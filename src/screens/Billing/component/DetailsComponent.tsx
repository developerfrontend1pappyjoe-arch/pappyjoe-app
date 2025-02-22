import React, { FC, PropsWithChildren } from "react";
import { InvoiceItemType } from "../Invoice/types";
import { StyleSheet, Text, View } from "react-native";
import { colorList } from "styles/global.styles";
import { Table, Row, Rows } from "react-native-table-component";
const tableHead = ["Qty", "Cost", "Discount", "Tax", "Total"];
const tableData = [
  [
    "Row 1, Cell 1",
    "Row 1, Cell 2 Row 1, Cell 2 Row 1, Cell 2 Row 1, Cell 2 Row 1, Cell 2",
    "Row 1, Cell 3",
  ],
  ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
  ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
];
const DetailsComponent = ({ data }: { data: InvoiceItemType }) => {
  return (
    <View style={style.container}>
      {/* <Text>{data.Item_name}</Text> */}
      <Table
        borderStyle={
          {
            // borderWidth: 0.5,
            // borderColor: colorList.Grey1,
            // borderRadius: 10,
          }
        }
      >
        <Row
          data={["Product & Services", `: ${data.Item_name}`]}
          style={{ height: 20 }}
          textStyle={{ textAlign: "left", paddingLeft: 3, fontWeight: "bold" }}
        />
        <Rows
          data={[
            ["Qty", `: ${data.quantity}`],
            ["Cost", `: ${data.cost}`],
            ["Discount", `: ${data.discount} ${data?.discount_type || ""}`],
            // [
            //   "Tax",
            //   `: ${data.cost != data.itemtotal ? data.tax : "0"}`,
            // ],
            [
              <Text style={style.textBold}>Total</Text>,
              <Text style={style.textBold}>: {data.itemtotal}</Text>,
            ],
          ]}
          style={{ height: 20 }}
          textStyle={{ textAlign: "left", paddingLeft: 3 }}
        />
      </Table>
    </View>
  );
};

export default DetailsComponent;
const style = StyleSheet.create({
  container: {
    paddingVertical: 8,
    margin: 2,
    borderWidth: 0.5,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: colorList.Grey2,
  },
  textBold: {
    fontWeight: "bold",
    marginLeft: 2,
  },
});
