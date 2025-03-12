import React, { FC, PropsWithChildren, useEffect } from "react";
import { InvoiceItemType } from "../Invoice/types";
import { StyleSheet, Text, View } from "react-native";
import { colorList } from "styles/global.styles";
import { Table, Row, Rows } from "react-native-table-component";
import { ReceiptItemType } from "../Receipt/types";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
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
const DetailsComponent = ({
  data,
  type,
}: {
  data: InvoiceItemType | ReceiptItemType;
  type: "invoice" | "receipt";
}) => {
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["financeMaster"]) as any;
  const calculateTax = (data: InvoiceItemType) => {
    const taxObect = cachedData?.data?.taxObject;
    const tax = taxObect ? taxObect[data?.tax_id] : {};
    let total =
      parseFloat(data?.cost || "0") * parseFloat(data?.quantity || "1");
    const percentage = parseFloat(tax?.percentage || "0");
    let discount = parseFloat(data?.discount || "0");
    if (data?.discount_type == "%") discount = (discount / 100) * total;
    // console.log(`cost = ${parseFloat(data?.cost || "0")} | quantity = ${parseFloat(data?.quantity || "1")} | ${discount}`);
    if (tax?.percentage) {
      return ((percentage / 100) * (total - discount)).toFixed(2);
    }
    return "";
  };
  return (
    <>
      {type == "invoice" && (
        <View
          style={[
            style.container,
            {
              borderWidth: 0.5,
              borderRadius: 5,
              borderColor: colorList.Grey2,
            },
          ]}
        >
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
              data={[
                "Product & Services",
                `: ${(data as InvoiceItemType).Item_name}`,
              ]}
              style={{ height: 20 }}
              textStyle={{
                textAlign: "left",
                paddingLeft: 3,
                fontWeight: "bold",
              }}
            />
            <Rows
              data={[
                ["Qty", `: ${(data as InvoiceItemType)?.quantity || ""}`],
                ["Cost", `: ${(data as InvoiceItemType)?.cost || ""}`],
                [
                  "Discount",
                  `: ${(data as InvoiceItemType)?.discount || ""} ${(data as InvoiceItemType)?.discount_type || ""}`,
                ],
                ["Tax", `: ${calculateTax(data as InvoiceItemType)}`],
                [
                  <Text style={style.textBold}>Total</Text>,
                  <Text style={style.textBold}>
                    : {(data as InvoiceItemType)?.itemtotal || ""}
                  </Text>,
                ],
              ]}
              style={{ height: 20 }}
              textStyle={{ textAlign: "left", paddingLeft: 3 }}
            />
          </Table>
        </View>
      )}
      {type == "receipt" && (
        <View style={[style.container]}>
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
              data={[
                <Text style={{ fontWeight: "bold", paddingLeft: 3 }}>
                  Receipt No:
                </Text>,
                `: ${(data as ReceiptItemType)?.receipt_no || ""}`,
              ]}
              style={{ height: 20 }}
              textStyle={{
                textAlign: "left",
              }}
            />
            <Rows
              data={[
                // [
                //   <Text style={{ fontWeight: "bold", paddingLeft: 3 }}>
                //     Payment Type:
                //   </Text>,
                //   `: ${(data as ReceiptItemType)?.ptype}`,
                // ],
                [
                  <Text style={{ fontWeight: "bold", paddingLeft: 3 }}>
                    Amount:
                  </Text>,
                  `: ${(data as ReceiptItemType)?.amount}`,
                ],
                [
                  <Text style={{ fontWeight: "bold", paddingLeft: 3 }}>
                    Invoice Nos:
                  </Text>,
                  `: ${(data as ReceiptItemType)?.inv_nos}`,
                ],
                [
                  <Text style={{ fontWeight: "bold", paddingLeft: 3 }}>
                    Date added:
                  </Text>,
                  `: ${moment((data as ReceiptItemType)?.added_date).format("DD-MM-YYYY")}`,
                ],
              ]}
              style={{ height: 20 }}
              textStyle={{ textAlign: "left", paddingLeft: 3 }}
            />
          </Table>
        </View>
      )}
    </>
  );
};

export default DetailsComponent;
const style = StyleSheet.create({
  container: {
    paddingVertical: 8,
    margin: 2,
    marginVertical: 5,
  },
  textBold: {
    fontWeight: "bold",
    marginLeft: 2,
  },
});

