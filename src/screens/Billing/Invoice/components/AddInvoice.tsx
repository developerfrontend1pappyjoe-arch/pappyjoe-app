import moment from "moment";
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { Badge, Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
// import AddInvoiceForm from "./AddInvoiceForm";
const AddInvoiceForm = lazy(() => import("./AddInvoiceForm"));
import { useDispatch, useSelector } from "react-redux";
import { closeBillingModal, editInvoiceList } from "redux/actions";
import {
  initialData,
  InvoicePayloadObject,
  InvoiceSaveObjectType,
} from "../types";
import { StoreTypes } from "redux/reducer";
import { useToast } from "react-native-toast-notifications";
// type SaveObjectType = Omit<InvoiceSaveObjectType, "item" | "item_tax">;
function AddInvoice() {
  const [startDateModal, setStartDateModal] = useState<boolean>();
  const [startDate, setStartDate] = useState(new Date());
  const {
    billing: { invoiceEditList },
    patientDetails,
  } = useSelector((state: any) => state) as StoreTypes;
  const [totalCalculated, setTotalCalculated] = useState<{
    total_cost: number;
    total_discount: number;
    total_tax: number;
    total_amount: number;
  }>({
    total_cost: 0,
    total_discount: 0,
    total_tax: 0,
    total_amount: 0,
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const handleAddInvoice = () => {
    // console.log([...invoiceEditList,initialData])
    dispatch(editInvoiceList([...invoiceEditList, initialData]));
  };

  const handleDelete = (index: number) => {
    const updated = [...invoiceEditList].filter((_, i) => i != index);
    dispatch(editInvoiceList(updated));
  };

  const handleEdit = (params: {
    index: number;
    data: InvoiceSaveObjectType;
  }) => {
    const updated = [...invoiceEditList];
    updated[params.index] = params.data;
    setTotalCalculated((prev) => ({
      ...prev,
      total_amount:
        prev.total_amount + parseFloat(params?.data?.item_total_amount || "0"),
      total_discount:
        prev.total_discount + parseFloat(params?.data?.item_discount || "0"),
      total_tax:
        prev.total_tax + parseFloat(params?.data?.item_tax_amount || "0"),
      total_cost:
        prev.total_cost + parseFloat(params?.data?.item_total_amount || "0"),
    }));
    dispatch(editInvoiceList(updated));
  };

  const isObjectValid = (item: InvoicePayloadObject) => {
    for (let key in requiredFields) {
      if (requiredFields[key as keyof typeof requiredFields]) {
        if (!Boolean(item[key as keyof typeof item])) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSaveInvoice = () => {
    let items: InvoicePayloadObject[] = [];
    let itemObject: InvoicePayloadObject;
    let errorList = "";
    if (invoiceEditList?.length) {
      invoiceEditList.forEach((item, index) => {
        itemObject = {
          item_id: item.item_id as string,
          item_cost: item.item_cost,
          item_discount: item.item_discount,
          item_discount_type: item.item_discount_type,
          item_quantity: item.item_quantity,
          item_tax_amount: item.item_tax_amount,
          item_tax_id: item.item_tax_id,
          item_total_amount: item.item_total_amount,
          total_amount: totalCalculated.total_amount.toFixed(2),
          total_cost: totalCalculated.total_cost.toFixed(2),
          total_discount: totalCalculated.total_discount.toFixed(2),
          total_tax: totalCalculated.total_tax.toFixed(2),
        };
        if (isObjectValid(itemObject)) {
          items = [...items, itemObject];
        } else {
          errorList +=
            index == invoiceEditList.length - 1
              ? `${index + 1}`
              : ` ${index + 1},`;
        }
      });
    }

    if (errorList.length == 0) {
      const saveObject = {
        patient_id: patientDetails?.id,
        date: moment(startDate).format("YYYY-MM-DD"),
        inv_number: null,
        items,
      };
      dispatch(closeBillingModal());
      console.log(patientDetails);
    } else {
      toast.show(`Please fill all fields in sl.no ${errorList}`, {
        type: "warning",
      });
    }
  };

  useEffect(() => {
    dispatch(editInvoiceList([initialData]));
  }, []);
  return (
    <View style={style.container}>
      <View
        style={{
          display: "flex",
          gap: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => setStartDateModal(true)} style={{}}>
          <TextInput
            dense
            mode="outlined"
            editable={false}
            value={moment(startDate).format("DD-MM-YYYY")}
            label="Invoice Date"
            right={
              <TextInput.Icon
                onPress={() => setStartDateModal(true)}
                icon={() => (
                  <Icon
                    size={25}
                    name="calendar-month"
                    color={colorList.Grey1}
                  />
                )}
              />
            }
          />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        ></View>
        <DatePicker
          modal
          mode="date"
          open={startDateModal}
          date={startDate}
          style={{ backgroundColor: colorList.white }}
          onConfirm={(date) => {
            setStartDateModal(false);
            setStartDate(date);
          }}
          onCancel={() => setStartDateModal(false)}
        />
      </View>
      <View style={{ paddingBottom: 250 }}>
        <FlatList
          style={{ height: Dimensions.get("screen").height - 272 }}
          keyboardShouldPersistTaps="handled"
          data={invoiceEditList}
          renderItem={({ item, index }) => (
            <Suspense
              fallback={
                <View>
                  <Text>Loading...</Text>
                </View>
              }
            >
              <AddInvoiceForm
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                index={index}
                item={item}
              />
            </Suspense>
          )}
        />
        <View style={{ display: "flex", gap: 4 }}>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Button
              compact
              onPress={handleSaveInvoice}
              textColor={colorList.white}
              contentStyle={{
                backgroundColor: colorList.socondary,
                flexDirection: "row-reverse",
              }}
            >
              Save invoice ({invoiceEditList?.length})
            </Button>
            <Button
              onPress={handleAddInvoice}
              compact
              textColor={colorList.primary}
              contentStyle={
                {
                  // backgroundColor: colorList.primary,
                  // flexDirection: "row-reverse",
                }
              }
              icon="plus"
            >
              ADD
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

export default AddInvoice;

const style = StyleSheet.create({
  container: {
    padding: 5,
  },
  cardStyle: {
    backgroundColor: colorList.white,
    padding: 10,
  },
  dropdownContainer: {
    borderWidth: 0.7,
    borderColor: colorList.Black,
    backgroundColor: colorList.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  containerStyle: {
    padding: 5,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 16,
    // borderWidth: 0.5,
    borderColor: colorList.Grey1,
    borderRadius: 8,
    color: colorList.dark,
  },
});

const requiredFields = {
  item_id: false,
  item_quantity: true,
  item_cost: true,
  item_tax_amount: true,
  item_tax_id: true,
  item_discount: true,
  item_discount_type: false,
  item_total_amount: true,
  total_cost: true,
  total_discount: true,
  total_tax: true,
  total_amount: true,
};


