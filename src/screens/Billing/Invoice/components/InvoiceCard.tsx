import React, { useContext, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Card, Menu, Text } from "react-native-paper";
import {
  InvoiceItemType,
  InvoiceObjectType,
  InvoiceSaveObjectType,
  ResultArrayType,
} from "../types";
import { colorList } from "styles/global.styles";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";
import DetailsComponent from "../../component/DetailsComponent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import MetrialIcon from "react-native-vector-icons/MaterialIcons";
import { useDeleteInvoice } from "../../hook/invoiceOperationHook";
import { CustomLoaderRound } from "components/CustomLoaderRound";
import { useModal } from "hooks";
import ShareComponent from "../../component/ShareComponent";
import { useDispatch, useSelector } from "react-redux";
import { editInvoiceList, openBillingModal, setBillingDate, setInvoiceNo } from "redux/actions";
import { useQueryClient } from "@tanstack/react-query";
// import { moderateScale } from "react-native-size-matters";
const btnSize = 22;
function InvoiceCard({ data, print }: { data: ResultArrayType; print: any }) {
  const patientDetails = useSelector((state: any) => state.patientDetails);

  const { CustomModal } = useModal();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setDeleteId(null);
  };
  const { mutate, isLoading } = useDeleteInvoice({
    onSuccess: handleCloseModal,
  });
  const handleDeleteInVoice = (invoiceNo: string) => {
    setDeleteId(invoiceNo);
  };

  const deleteInvoice = () => {
    const formData = new FormData();
    formData.append("inv_number", deleteId);
    console.log(formData);
    mutate({ params: formData, method: "delete" });
  };

  const handlePrint = (id: string) => {
    if (print[id]?.url) {
      Linking.openURL(print[id]?.url).catch((err) => {
        Alert.alert("Error", err.response.data.message);
        console.error("An error occurred", err);
      });
    } else {
      Alert.alert("Warning", "No Print Url Found please try again later");
    }
    console.log("print", print[id]);
  };

  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["financeMaster"]) as any;

  const handleEdit = (data: InvoiceItemType[], invoiceNo: string) => {
    const taxObjet = cachedData?.data?.taxObject || {}
    const list: InvoiceSaveObjectType[] = [];
    let date = moment().format("YYYY-MM-DD")
    data.forEach((item) => {
      const item_id = item?.item_type == "procedure" ? `P_${item.item_id}` : `I_${item.item_id}` 
      date = item.date_time
      const editItems: InvoiceSaveObjectType = {
        fullTotal: item.itemtotal,
        item_cost: item.cost,
        item: {
          id: item_id,
          text: item.Item_name,
          tax_id: "",
        },
        item_discount: item.discount,
        item_discount_type: item.discount_type,
        item_quantity: item.quantity,
        item_tax: taxObjet ?  taxObjet[item.tax_id] : {
          id: "",
          percentage: "",
          taxname: "",
        },
        item_tax_amount: item.tax,
        item_tax_id: item.tax_id,
        item_total_amount: (
          parseFloat(item?.cost || "0") * parseFloat(item?.quantity || "0")
        ).toFixed(2),
        item_id,
      };
      list.push(editItems);
    });  
    console.log("date in edit on click-->",date);
    
    dispatch(setBillingDate(date)) 
    dispatch(setInvoiceNo(invoiceNo));
    dispatch(editInvoiceList(list));
    dispatch(openBillingModal());
  };

  return (
    <View style={[style.container]}>
      <CustomModal
        title={
          <View
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text>{`Delete Invoice (No : ${deleteId})`}</Text>
          </View>
        }
        open={Boolean(deleteId)}
        handleCloseModal={handleCloseModal}
      >
        <>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 5,
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text> Are you sure you want to delete this invoice ?</Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
              gap: 8,
              paddingHorizontal: 8,
            }}
          >
            <Button
              disabled={isLoading}
              compact
              textColor={colorList.red}
              onPress={handleCloseModal}
            >
              No
            </Button>
            <Button
              disabled={isLoading}
              loading={isLoading}
              compact
              textColor={colorList.socondary}
              onPress={deleteInvoice}
            >
              Yes
            </Button>
          </View>
        </>
      </CustomModal>
      <View style={style.dateContainer}>
        <FontAwesomeIcon name="calendar" size={16} color={colorList.white} />
        <Text style={style.dateTextColor}>
          {moment(data.date).format("DD-MM-YYYY")}
        </Text>
      </View>
      <FlatList
        data={data.list}
        renderItem={({ item: invoice }: { item: InvoiceObjectType }) => (
          <Card style={style.cardContainer}>
            <View style={style.topContainer}>
              <View style={style.invoiceContainerStyle}>
                <Text style={style.invoiceDateText} variant="titleSmall">
                  Invoice no : {invoice.inviceNo}
                </Text>
              </View>
              <View
                style={[
                  style.statusContainer,
                  {
                    backgroundColor:
                      statusColor[invoice.status as keyof typeof statusColor]
                        .light,
                  },
                ]}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "bold",
                      color:
                        statusColor[invoice.status as keyof typeof statusColor]
                          .main,
                    }}
                  >
                    {statusText[invoice.status as keyof typeof statusText] ||
                      ""}
                  </Text>
                  {invoice.status == "partial" ? (
                    <View>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "bold",
                          color:
                            statusColor[
                              invoice.status as keyof typeof statusColor
                            ].main,
                        }}
                      >{`Total: ${invoice?.invoicetotal}`}</Text>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "bold",
                          color:
                            statusColor[
                              invoice.status as keyof typeof statusColor
                            ].main,
                        }}
                      >{`Balance: ${invoice?.invoicebalance}`}</Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "bold",
                        color:
                          statusColor[
                            invoice.status as keyof typeof statusColor
                          ].main,
                      }}
                    >
                      {invoice.status == "paid"
                        ? `Total: ${invoice?.invoicetotal}`
                        : `Balance: ${invoice?.invoicebalance}`}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <FlatList
              data={invoice?.data || []}
              renderItem={({ item }) => (
                <DetailsComponent type="invoice" data={item} />
              )}
            />
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                paddingVertical: 8,
              }}
            >
              {invoice.status == "Active" ? (
                <View style={[style.buttonContainer]}>
                  <TouchableOpacity>
                    <Icon
                      name="pencil"
                      size={btnSize}
                      color={colorList.socondary}
                      onPress={() => {
                        handleEdit(invoice.data, invoice.inviceNo,);
                      }}
                    />
                  </TouchableOpacity>
                  {isLoading ? (
                    <CustomLoaderRound />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        handleDeleteInVoice(invoice.inviceNo);
                      }}
                    >
                      <Icon
                        name="delete"
                        size={btnSize}
                        color={colorList.red}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handlePrint(invoice.inviceNo)}
                  >
                    <Icon
                      name="printer"
                      size={btnSize}
                      color={colorList.primary}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity onPress={() => handlePrint(invoice.inviceNo)}>
                    <Icon
                      name="printer"
                      size={btnSize}
                      color={colorList.primary}
                    />
                  </TouchableOpacity>
                </View>
              )}

              <View style={style.buttonContainer}>
                <ShareComponent
                  subject="Invoice"
                  content={`Dear ${patientDetails.Name || ""} click on the link ${print[invoice.inviceNo]?.url || ""} to view your invoice.`}
                />
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

export default InvoiceCard;

const statusColor = {
  paid: colorList.palette.success,
  Active: colorList.palette.error,
  partial: colorList.palette.warning,
};
const statusText = {
  paid: "FULLY PAID",
  Active: "NOT PAID",
  partial: "PARTIALLY PAID",
};

const style = StyleSheet.create({
  container: {
    paddingBottom: 5,
    paddingTop: 10,
    paddingHorizontal: 5,
    marginTop: 4,
    marginBottom: 15,
    display: "flex",
    gap: 5,
    borderWidth: 1,
    borderColor: colorList.Grey2,
    borderRadius: 10,
  },
  dateContainer: {
    backgroundColor: colorList.primary,
    width: 120,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    borderRadius: 5,
    flexDirection: "row",
    gap: 4,
  },
  dateTextColor: {
    color: colorList.white,
    fontSize: 11,
    fontWeight: "bold",
  },
  cardContainer: {
    marginVertical: 4,
    marginLeft: 0,
    // borderWidth: 0.5,
    // borderColor: colorList.Grey1,
    // borderRadius: 5,
    paddingTop: 5,
    paddingHorizontal: 5,
    backgroundColor: "#f8f9fa",
  },
  invoiceContainerStyle: {
    // backgroundColor: colorList.white,
    width: 115,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colorList.socondary,
  },
  invoiceDateText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colorList.socondary,
    margin: 0,
    padding: 0,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    paddingHorizontal: 5,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 5,
  },
});
function useDelete() {
  throw new Error("Function not implemented.");
}
