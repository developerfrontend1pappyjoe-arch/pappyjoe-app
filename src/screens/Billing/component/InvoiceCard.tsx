import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Button, Card, Menu, Modal, Portal, SegmentedButtons, Text } from "react-native-paper";
import {
  InvoiceItemType,
  InvoiceObjectType,
  ResultArrayType,
} from "../Invoice/types";
import { colorList } from "styles/global.styles";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";
import DetailsComponent from "./DetailsComponent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { InvoiceContext } from "../Invoice";
import { useDeleteInvoice } from "../hook/invoiceOperationHook";
import CircularProgress from "components/CircularProgress";
import { CustomLoaderRound } from "components/CustomLoaderRound";
import { useModal } from "hooks";
const btnSize = 22;
function InvoiceCard({ data }: { data: ResultArrayType }) {
    const dimention = useWindowDimensions()
    const {CustomModal} = useModal()
  const [openShareMenu, setOpenShareMenu] = useState<string | null>("");
  const [deleteId,setDeleteId] = useState<string|null>(null)
  const onOpenMenu = (invoiceNo: string) => {
    setOpenShareMenu(invoiceNo);
  };
  const onCloseMenu = () => {
    setOpenShareMenu(null);
  };
  const handleCloseModal = ()=>{
    setDeleteId(null)
  }
const {mutate,isLoading} = useDeleteInvoice()
  const handleDeleteInVoice = (invoiceNo:string)=>{
    setDeleteId(invoiceNo)
    //  const formData = new FormData()
    //  formData.append("inv_number",invoiceNo)
    //  mutate({params:formData,method:"delete"})
  }

  return (
    <View style={[style.container]}>

     <CustomModal title="Delete Invoice" open={Boolean(deleteId)} handleCloseModal={handleCloseModal}>
      <View>
         <Text> Are you sure to delete this invoice </Text>
      </View>
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
                      >{`Total: ${invoice.invoicetotal}`}</Text>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: "bold",
                          color:
                            statusColor[
                              invoice.status as keyof typeof statusColor
                            ].main,
                        }}
                      >{`Balance: ${invoice.invoicetotal}`}</Text>
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
                        ? `Total: ${invoice.invoicetotal}`
                        : `Balance: ${invoice.invoicetotal}`}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <FlatList
              data={invoice.data || []}
              renderItem={({ item }) => <DetailsComponent data={item} />}
            />
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                paddingVertical: 8,
              }}
            >
              <View style={[style.buttonContainer]}>
                <TouchableOpacity>
                  <Icon
                    name="pencil"
                    size={btnSize}
                    color={colorList.socondary}
                  />
                </TouchableOpacity>
               {isLoading ? <CustomLoaderRound /> : <TouchableOpacity onPress={()=>{handleDeleteInVoice(invoice.inviceNo)}}>
                  <Icon name="delete" size={btnSize} color={colorList.red} />
                </TouchableOpacity>}
                <TouchableOpacity>
                  <Icon
                    name="printer"
                    size={btnSize}
                    color={colorList.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.buttonContainer}>
                <Menu
                  visible={Boolean(openShareMenu == invoice.inviceNo)}
                  onDismiss={onCloseMenu}
                  anchor={
                    <TouchableOpacity
                      onPress={() => {
                        onOpenMenu(invoice.inviceNo);
                      }}
                    >
                      <Icon
                        name="share-variant"
                        size={btnSize}
                        color={colorList.primary}
                      />
                    </TouchableOpacity>
                  }
                >
                  <Menu.Item
                    onPress={() => {}}
                    title={
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Icon
                          name="email"
                          size={btnSize}
                          color={colorList.blue}
                        />
                        <Text>Email</Text>
                      </View>
                    }
                    disabled
                  />
                  <Menu.Item
                    onPress={() => {}}
                    title={
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Icon
                          name="whatsapp"
                          size={btnSize}
                          color={colorList.socondary}
                        />
                        <Text>Whatsapp</Text>
                      </View>
                    }
                    disabled
                  />
                  <Menu.Item
                    onPress={() => {}}
                    title={
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <FontAwesomeIcon
                          name="telegram"
                          size={btnSize}
                          color={colorList.primary}
                        />
                        <Text>Telegram</Text>
                      </View>
                    }
                  />
                </Menu>
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
    width: 100,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    borderRadius: 5,
    flexDirection:"row",
    gap:4
  },
  dateTextColor: {
    color: colorList.white,
    fontSize: 12,
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
    fontSize: 10,
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

