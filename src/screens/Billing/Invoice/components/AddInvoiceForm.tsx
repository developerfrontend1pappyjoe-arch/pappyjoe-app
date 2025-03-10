import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Card,
  Divider,
  List,
  Text,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native-paper";
import { colorList } from "styles/global.styles";
import {
  InvoiceSaveObjectType,
  ProcedureMatsterItem,
  TaxObjectType,
} from "../types";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useToast } from "react-native-toast-notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInvoiceMasterList } from "screens/Billing/services";
import { useSelector } from "react-redux";
import _ from "lodash";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const patientDetails = useSelector((state: any) => state.patientDetails) || {
    id: "",
  };
  const { data: masterList, isLoading } = useQuery(
    ["fetchInvoiceMaster", { searchTerm, patientDetails }],
    () => getInvoiceMasterList({ searchTerm, patientId: patientDetails.id })
  );
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["financeMaster"]);
  const handleCalculate = (
    item: InvoiceSaveObjectType
  ): InvoiceSaveObjectType => {
    const details = {
      tax: parseFloat(item.item_tax?.percentage || "0"),
      cost: parseFloat(item?.item_cost || "0"),
      discount: parseFloat(item?.item_discount || "0"),
      quantity: parseFloat(item?.item_quantity || "0"),
      total: 0,
      calculatedTotal: 0,
      fullTotal: 0,
    };
    details.total = details.quantity * details.cost;
    details.fullTotal = details.total;
    if (item.item_discount_type == "%" && details.discount != 0) {
      details.calculatedTotal =
        details.total - (details.discount * details.total) / 100;
      details.fullTotal =
        details.calculatedTotal + (details.tax * details.calculatedTotal) / 100;
    } else if (item.item_discount_type == "INR" && details.discount != 0) {
      details.calculatedTotal = details.total - details.discount;
      details.fullTotal =
        details.calculatedTotal + (details.tax * details.calculatedTotal) / 100;
    } else {
      details.fullTotal = details.total + (details.tax * details.total) / 100;
    }
    return {
      ...item,
      item_tax_amount: (
        ((details.tax * details.total) / 100) *
        details.quantity
      ).toFixed(2),
      item_total_amount: details.total.toFixed(2),
      fullTotal: details.fullTotal.toFixed(2),
    };
  };
  const deleteFromList = () => {
    if (handleDelete) {
      handleDelete(index);
    }
  };
  const handleDiscountChange = (e: boolean) => {
    handleEdit &&
      handleEdit({
        data: handleCalculate({ ...item, item_discount_type: e ? "INR" : "%" }),
        index,
      });
  };

  const handleTaxChange = (item_tax: TaxObjectType) => {
    handleEdit &&
      handleEdit({
        data: handleCalculate({ ...item, item_tax, item_tax_id: item_tax.id }),
        index,
      });
  };

  const handleItemChange = (data: ProcedureMatsterItem) => {
    let update: InvoiceSaveObjectType = { ...item, item: data };
    const item_tax = cachedData?.data?.taxes?.find(
      (i: any) => i.id == update?.item?.tax_id
    ) || {
      id: "",
      percentage: "0",
      taxname: "",
    };
    update.item_cost = update?.item?.cost || "0";
    update = {
      ...update,
      item_tax,
      item_quantity: "1",
      item_id: data.id,
      item_cost: update?.item?.cost || "0",
      item_tax_id: item_tax.id,
    };

    handleEdit && handleEdit({ data: handleCalculate(update), index });
  };

  const handleChange = (field: string, data: any) => {
    const update: InvoiceSaveObjectType = { ...item, [field]: data };
    if (handleEdit) {
      handleEdit({ data: handleCalculate(update), index });
    }
  };

  const searchItem = (text: string) => {
    setSearchTerm(text);
  };

  const handleSearch = _.debounce(searchItem, 500);
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
          data={masterList?.data || []}
          labelField="text"
          valueField="id"
          placeholder={item.item?.text || "Select Item"}
          accessibilityLabel={'Select'}
          renderInputSearch={() => (
            <View style={{ paddingHorizontal: 6 }}>
              <TextInput
                dense
                mode="outlined"
                onChangeText={handleSearch}
                label={"Search"}
                right={ isLoading ? <TextInput.Icon icon={() => <ActivityIndicator />} /> : null }
              />
            </View>
          )}
          renderItem={(item) => (
            <>
              <List.Item title={item.text} />
              <Divider />
            </>
          )}
          onChange={handleItemChange}
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
            justifyContent: "center",
          }}
        >
          <Dropdown
            search
            inputSearchStyle={style.inputSearchStyle}
            style={[
              style.dropdownContainer,
              { paddingVertical: 2, borderWidth: 0.8, marginTop: 5 },
            ]}
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
            data={cachedData?.data?.taxes || []}
            labelField="percentage"
            valueField="percentage"
            accessibilityLabel="Tax"
            renderItem={(tax) => (
              <>
                <List.Item
                  title={`${tax?.taxname || ""} ${tax?.percentage || ""} %`}
                />
                <Divider />
              </>
            )}
            onChange={handleTaxChange}
          />
          <TextInput
            style={{ flex: 1 }}
            editable={false}
            value={`${item.fullTotal}`}
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
            paddingTop: 8,
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
    flex: 1,
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


