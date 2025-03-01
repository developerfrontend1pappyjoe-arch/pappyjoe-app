import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Card,
  Divider,
  List,
  Text,
  TextInput,
  Switch,
} from "react-native-paper";
import { colorList } from "styles/global.styles";
import { InvoiceSaveObjectType } from "../types";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useToast } from "react-native-toast-notifications";
const keyboardType = "number-pad";
type AddInvoiceFormParamsType = {
  index: number;
  item: InvoiceSaveObjectType;
  handleDelete?: (id: number) => void;
  handleEdit?: (params: { index: number; data: InvoiceSaveObjectType }) => void;
};
const AddInvoiceForm = ({
  index,
  item,
  handleDelete,
  handleEdit,
}: AddInvoiceFormParamsType) => {
  const toast = useToast();
  const [calculationData, setCalculationData] = useState({
    Price: 0,
    Quandity: 0,
    Discount: 0,
  });
  const deleteFromList = () => {
    if (handleDelete) {
      handleDelete(index);
    }
  };
  const handleDiscountChange = (e: boolean) => {
    const data = { ...item };
    data.item_discount_type = e ? "INR" : "%";
    let total = 0;
    if (data.item_discount_type == "%") {
      total =
        calculationData.Price * calculationData.Quandity -
        (calculationData.Discount / 100) *
          (calculationData.Price * calculationData.Quandity);
    } else {
      total =
        calculationData.Price * calculationData.Quandity -
        calculationData.Discount;
    }
    data.item_total_amount = `${total}`
    if (handleEdit) {
      handleEdit({ data, index });
    }
  };

  const handleChange = (field: string, data: any) => {
    const update = { ...item };
    update[field as keyof typeof update] = data;
    let total = 0;
    if (Boolean(checkingKeys[field as keyof typeof checkingKeys])) {
      const updated = {
        ...calculationData,
        [checkingKeys[field as keyof typeof checkingKeys]]: parseFloat(
          data || "0"
        ),
      };
      setCalculationData(updated);
      if (
        typeof updated.Quandity == "number" &&
        typeof updated.Price == "number" &&
        typeof updated.Discount == "number"
      ) {
        console.log(
          (updated.Discount / 100) * (updated.Price * updated.Quandity)
        );

        total =
          item.item_discount_type == "%"
            ? updated.Price * updated.Quandity -
              (updated.Discount / 100) * (updated.Price * updated.Quandity)
            : updated.Price * updated.Quandity - updated.Discount;
      } else {
        toast.show(
          `${checkingKeys[field as keyof typeof checkingKeys]} must be a number`,
          {
            type: "warning",
          }
        );
      }
    }
    update.item_total_amount = `${total}`;
    if (handleEdit) {
      handleEdit({ data: update, index });
    }
  };

  return (
    <View style={{ paddingVertical: 5 }}>
      <Card style={style.cardStyle}>
        <View style={{ paddingBottom: 8 }}>
          <Text>Sl.No {index + 1}</Text>
        </View>
        <Dropdown
          search
          inputSearchStyle={style.inputSearchStyle}
          style={style.dropdownContainer}
          selectedTextStyle={{
            fontSize: 13,
            color: colorList.dark,
          }}
          containerStyle={{
            marginTop: 8,
            borderRadius: 8,
            borderWidth: 0.5,
            borderBlockColor: colorList.Grey1,
            paddingVertical: 8,
          }}
          value={item.item}
          mode="default"
          data={arra}
          labelField="text"
          valueField="id"
          accessibilityLabel="Select an item"
          renderItem={(item) => (
            <>
              <List.Item title={item.text} />
              <Divider />
            </>
          )}
          onChange={(data) => {
            handleChange("item", data);
          }}
        />
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <TextInput
            keyboardType={keyboardType}
            value={item.item_quantity}
            onChangeText={(value) => {
              handleChange("item_quantity", value);
            }}
            style={{ flex: 1 }}
            dense
            mode="outlined"
            label="Quantity"
          />
          <TextInput
            value={item.item_cost}
            keyboardType={keyboardType}
            onChangeText={(value) => {
              handleChange("item_cost", value);
            }}
            style={{ flex: 1 }}
            dense
            mode="outlined"
            label="Unit Price"
          />
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <TextInput
            value={item.item_discount}
            keyboardType={keyboardType}
            onChangeText={(value) => {
              handleChange("item_discount", value);
            }}
            style={{ flex: 1 }}
            dense
            mode="outlined"
            label="Discount"
          />

          <View
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              gap: 4,
            }}
          >
            <FontAwesome5
              name="percentage"
              size={20}
              color={
                item?.item_discount_type == "%"
                  ? colorList.socondary
                  : colorList.Grey1
              }
            />
            <Switch
              color={colorList.Grey1}
              value={item?.item_discount_type == "INR"}
              onValueChange={handleDiscountChange}
            />
            <Icon
              name="currency-rupee"
              size={20}
              color={
                item?.item_discount_type == "INR"
                  ? colorList.socondary
                  : colorList.Grey1
              }
            />
          </View>

          {/* <TextInput
            style={{ flex: 1 }}
            dense
            mode="outlined"
            label="Item Tax"
          /> */}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            justifyContent:'center'
          }}
        >
        <Dropdown
          search
          inputSearchStyle={style.inputSearchStyle}
          style={[style.dropdownContainer,{paddingVertical:2,borderWidth:.8}]}
          selectedTextStyle={{
            fontSize: 13,
            color: colorList.dark,
          }}
          containerStyle={{
            marginTop: 8,
            borderRadius: 8,
            borderWidth: 0.8,
            borderBlockColor: colorList.Grey1,
            paddingVertical: 5,
          }}
          value={item.item_tax}
          mode="default"
          data={taxArray}
          labelField="taxValue"
          valueField="value"
          
          accessibilityLabel="Tax"
          renderItem={(tax) => (
            <>
              <List.Item title={`${tax.taxValue}`} />
              <Divider />
            </>
          )}
          onChange={(data) => {
            handleChange("item_tax", data);
          }}
        />
          <TextInput
            style={{ flex: 1 }}
            editable={false}
            value={item.item_total_amount}
            dense
            mode="outlined"
            label="Total"
          />
        </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingTop:8
            }}
          >
            {index > 0 && (
              <TouchableOpacity
                style={{
                  //   backgroundColor: colorList.red,
                  borderColor: colorList.red,
                  borderWidth: 0.5,
                  padding: 5,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
                onPress={deleteFromList}
              >
                <Text style={{ color: colorList.red }}>Delete</Text>
                <Text style={{ color: colorList.red }}>
                  <Icon name="delete" size={20} />
                </Text>
              </TouchableOpacity>
            )}
          </View>
      </Card>
    </View>
  );
};

export default AddInvoiceForm;

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
    flex:1
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

const checkingKeys = {
  item_discount: "Discount",
  item_quantity: "Quandity",
  item_cost: "Price",
};

const taxArray = [
    {
        taxType:"cess",
        value:1,  
        taxValue:"Cess 1%"
    }
]

const arra = [
  {
    id: "PT_398899__4642954",
    text: "USG ABDOMEN SCAN (PLANNED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_395713__4033385",
    text: "MRI HEAD 10 TESLA (COMPLETED PROCEDURE)",
    tax_id: "211",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
  {
    id: "PT_0__4032028",
    text: "Consultation (COMPLETED PROCEDURE)",
    tax_id: "",
  },
];
