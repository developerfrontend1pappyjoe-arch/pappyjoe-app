import moment from "moment";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
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
import {
  closeBillingModal,
  editInvoiceList,
  setBillingDate,
  setInvoiceNo,
} from "redux/actions";
import {
  initialData,
  InvoicePayloadObject,
  InvoiceSaveObjectType,
} from "../types";
import { StoreTypes } from "redux/reducer";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "@tanstack/react-query";
import { saveInvoice } from "screens/Billing/services";
// type SaveObjectType = Omit<InvoiceSaveObjectType, "item" | "item_tax">;
function AddInvoice() {
  const [startDateModal, setStartDateModal] = useState<boolean>();
  const [startDate, setStartDate] = useState(new Date());
  const {
    billing: { invoiceEditList, invoiceNo, editDate },
    patientDetails,
  } = useSelector((state: any) => state) as StoreTypes;
  const toast = useToast();
  const dispatch = useDispatch();
  const { mutate: save, isLoading } = useMutation(saveInvoice, {
    onSuccess: (result) => {
      if (result.status >= 200 || result.status < 300) {
        toast.show(result.message, {
          type: "success",
        });
        dispatch(setBillingDate(moment().format("YYYY-MM-DD")));
        dispatch(editInvoiceList([]));
        dispatch(setInvoiceNo(null));
        dispatch(closeBillingModal());
      } else {
        toast.show(result.message, {
          type: "warning",
        });
      }
    },
    onError: () => {
      toast.show("Something went wrong !", {
        type: "error",
      });
    },
  });

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

    let total_amount: number = 0;
    let total_cost: number = 0;
    let total_discount: number = 0;
    let total_tax: number = 0;

    if (invoiceEditList?.length) {
      invoiceEditList.forEach((item, index) => {
        total_amount = parseFloat(item.item_total_amount || "0");
        total_cost = parseFloat(item.item_cost || "0");
        total_discount = parseFloat(item.item_discount || "0");
        total_tax = parseFloat(item.item_tax_amount || "0");
        itemObject = {
          item_id: item.item_id as string,
          item_cost: item.item_cost,
          item_discount: item.item_discount,
          item_discount_type: item.item_discount_type,
          item_quantity: item.item_quantity,
          item_tax_amount: item.item_tax_amount,
          item_tax_id: item.item_tax_id,
          item_total_amount: item.item_total_amount,
          total_amount: "",
          total_cost: "",
          total_discount: "",
          total_tax: "",
        };
        items = [...items, itemObject];
        // if (isObjectValid(itemObject)) {
        //   items = [...items, itemObject];
        // } else {
        //   errorList +=
        //     index == invoiceEditList.length - 1
        //       ? `${index + 1}`
        //       : ` ${index + 1},`;
        // }
      });
    }

    if (errorList.length == 0 && invoiceEditList?.length > 0) {
      const saveObject: {
        patient_id: string | undefined;
        date: string;
        items: InvoicePayloadObject[];
        inv_number?: string;
      } = {
        patient_id: patientDetails?.id,
        date: editDate,
        items,
      };
      invoiceNo && (saveObject["inv_number"] = invoiceNo);
      console.log(saveObject);
      save({
        ...saveObject,
        total: {
          total_amount: total_amount.toFixed(2),
          total_cost: total_cost.toFixed(2),
          total_discount: total_discount.toFixed(2),
          total_tax: total_tax.toFixed(2),
        },
      });
    } else {
      toast.show(
        invoiceEditList.length == 0
          ? `There is no invoice to save. Please add an invoice before saving.`
          : `Please fill all fields in sl.no ${errorList}`,
        {
          type: "warning",
        }
      );
    }
  };

  const editList = useMemo(() => invoiceEditList, [invoiceEditList]);

  useEffect(() => {
    if (invoiceEditList?.length == 0) {
      dispatch(editInvoiceList([initialData]));
    }
  }, []);

  useEffect(() => {
    console.log("editDate========>", editDate);
  }, [editDate]);
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
            value={moment(editDate).format("DD-MM-YYYY")}
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
          date={new Date(editDate)}
          style={{ backgroundColor: colorList.white }}
          onConfirm={(date) => {
            setStartDateModal(false);
            console.log(
              `moment(new Date(date)).format("YYYY-MM-DD")--->`,
              moment(new Date(date)).format("YYYY-MM-DD")
            );
            dispatch(
              setBillingDate(moment(new Date(date)).format("YYYY-MM-DD"))
            );
          }}
          onCancel={() => setStartDateModal(false)}
        />
      </View>
      <View style={{ paddingBottom: 250 }}>
        <FlatList
          style={{ height: Dimensions.get("screen").height - 272 }}
          keyboardShouldPersistTaps="handled"
          data={editList}
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
              disabled={isLoading}
              loading={isLoading}
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

const data = {
  date: "2025-03-11",
  items: [
    {
      item_cost: "18500",
      item_discount: "0",
      item_discount_type: "%",
      item_id: "P_395713",
      item_quantity: "1",
      item_tax_amount: "925.00",
      item_tax_id: "211",
      item_total_amount: "18500.00",
      total_amount: "",
      total_cost: "",
      total_discount: "",
      total_tax: "",
    },
  ],
  patient_id: "5596833",
};
