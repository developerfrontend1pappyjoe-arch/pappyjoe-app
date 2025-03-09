import React from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

import { colorList } from "styles/global.styles";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import MetrialIcon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import DetailsComponent from "screens/Billing/component/DetailsComponent";
import ShareComponent from "screens/Billing/component/ShareComponent";
const btnSize = 22;
function ReceiptCard({ data, print }: { data: any; print: any }) {
  const patientDetails = useSelector((state:any)=>state.patientDetails)
  const handlePrint = (id: string) => {
    if (print[id]?.url) {
      Linking.openURL(print[id]?.url).catch((err) => {
        Alert.alert("Error", err.response.data.message);
        console.error("An error occurred", err);
      });
    } else {
      Alert.alert("Warning", "No Print Url Found please try again later");
    }
  };

  return (
    <View style={[style.container]}>
      <View style={style.dateContainer}>
        <FontAwesomeIcon name="calendar" size={16} color={colorList.white} />
        <Text style={style.dateTextColor}>
          {moment(data.date).format("DD-MM-YYYY")}
        </Text>
      </View>
      <FlatList
        data={data.list}
        renderItem={({ item: receipt }: { item: any }) => (
          <View style={style.cardContainer}>
            <FlatList
              data={receipt.data || []}
              renderItem={({ item }) => (
                <DetailsComponent type="receipt" data={item} />
              )}
            />
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                paddingBottom: 5,
                paddingHorizontal: 5,
              }}
            >
              <View style={[style.buttonContainer]}>
                  <TouchableOpacity
                    onPress={() => handlePrint(receipt?.receiptNo)}
                  >
                    <Icon
                      name="printer"
                      size={btnSize}
                      color={colorList.primary}
                    />
                  </TouchableOpacity>
                </View>

              <View style={style.buttonContainer}>
               <ShareComponent subject="Receipt" content={`Dear ${patientDetails.Name || ""} click on the link ${print[receipt.inviceNo]?.url || ""} to view your Receipt.`}/>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default ReceiptCard;

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
    marginTop: 4,
    display: "flex",
    gap: 5,
    // marginBottom: 15,
    // paddingBottom: 5,
    // paddingTop: 10,
    // paddingHorizontal: 5,
    // borderWidth: 1,
    // borderColor: colorList.Grey2,
    // borderRadius: 10,
  },
  dateContainer: {
    backgroundColor: colorList.primary,
    width: 100,
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
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContainer: {
    marginTop: 4,
    marginLeft: 0,
    borderWidth: 0.5,
    borderColor: colorList.Grey1,
    borderRadius: 10,
    paddingTop: 5,
    paddingHorizontal: 2,
    // backgroundColor: "#f8f9fa",
  },
  receiptContainerStyle: {
    // backgroundColor: colorList.white,
    width: 115,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colorList.socondary,
  },
  receiptDateText: {
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
