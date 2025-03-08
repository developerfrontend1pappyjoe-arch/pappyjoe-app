import moment from "moment";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { Badge, Button, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
// import AddInvoiceForm from "./AddInvoiceForm";
const AddInvoiceForm = lazy(()=>import("./AddInvoiceForm"))
import { useDispatch, useSelector } from "react-redux";
import { editInvoiceList } from "redux/actions";
import { initialData, InvoiceSaveObjectType } from "../types";
import { StoreTypes } from "redux/reducer";
import { useToast } from "react-native-toast-notifications";
import { getInvoiceMasterList } from "screens/Billing/services";
type SaveObjectType = Omit<InvoiceSaveObjectType, "item" | "item_tax">;
function AddInvoice() {
  const [startDateModal, setStartDateModal] = useState<boolean>();
  const [startDate, setStartDate] = useState(new Date());
  const {
    billing: { invoiceEditList },
    patientDetails,
  } = useSelector((state: any) => state) as StoreTypes;
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
    dispatch(editInvoiceList(updated));
  };

  const isObjectValid = (item: SaveObjectType) => {
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
    let items: SaveObjectType[] = [];
    let itemObject: SaveObjectType;
    let errorList = "";
    if (invoiceEditList?.length) {
      invoiceEditList.forEach((item, index) => {
        itemObject = {
          item_id: item?.item?.id,
          item_quantity: item?.item_quantity,
          item_cost: item?.item_cost,
          item_tax_amount: item?.item_tax_amount,
          item_tax_id: `${item?.item_tax?.value}`,
          item_discount: item?.item_discount,
          item_discount_type: item?.item_discount_type,
          item_total_amount: item?.item_total_amount,
          total_cost: item?.total_cost,
          total_discount: item?.total_discount,
          total_tax: `${item?.item_tax?.taxValue}`,
          total_amount: item?.total_amount,
          fullTotal:item?.fullTotal
        };
        console.log(itemObject);
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
        </View>
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
            <Suspense fallback={<View><Text>Loading...</Text></View>}>
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
              alignItems: "flex-end",
            }}
          >
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
