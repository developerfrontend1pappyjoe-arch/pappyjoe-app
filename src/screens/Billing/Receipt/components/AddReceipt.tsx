import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Divider, List, TextInput } from "react-native-paper";
import { colorList } from "styles/global.styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
const AddReceipt = () => {
  const [startDateModal, setStartDateModal] = useState<boolean>();
  const [receiptData, setReceiptData] = useState({
    startDate: new Date(),
  });
  const handleSaveReceipt = () => {};
  return (
    <View >
       <ScrollView style={style.container}>
       <View
        style={{
          gap: 4,
          flexDirection: "column",
        }}
      >
        <TouchableOpacity onPress={() => setStartDateModal(true)}>
          <TextInput
            dense
            mode="outlined"
            editable={false}
            value={moment(receiptData.startDate).format("DD-MM-YYYY")}
            label="Payment Date"
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
        <DatePicker
          modal
          mode="date"
          open={startDateModal}
          date={receiptData.startDate}
          style={{ backgroundColor: colorList.white }}
          onConfirm={(date) => {
            setStartDateModal(false);
            setReceiptData((prev) => ({
              ...prev,
              startDate: date,
            }));
          }}
          onCancel={() => setStartDateModal(false)}
        />
      </View>
      <View>
        <Dropdown
          style={[style.dropdownContainer, { borderWidth: 0.8, marginTop: 5 }]}
          selectedTextStyle={{
            fontSize: 13,
            color: colorList.dark,
          }}
          containerStyle={{
            marginTop: 8,
            borderRadius: 8,
            borderWidth: 0.8,
            borderBlockColor: colorList.Grey1,
          }}
          value={null}
          mode="default"
          data={[{ item: "item" }]}
          labelField="item"
          valueField="item"
          placeholder="Instrument Type"
          renderItem={(data) => (
            <>
              <List.Item title={data.item} />
              <Divider />
            </>
          )}
          onChange={() => {}}
        />
      </View>

      <View>
        <Dropdown
          style={[style.dropdownContainer, { borderWidth: 0.8, marginTop: 5 }]}
          selectedTextStyle={{
            fontSize: 13,
            color: colorList.dark,
          }}
          containerStyle={{
            marginTop: 8,
            borderRadius: 8,
            borderWidth: 0.8,
            borderBlockColor: colorList.Grey1,
          }}
          value={null}
          mode="default"
          data={[{ item: "item" }]}
          labelField="item"
          valueField="item"
          placeholder="Payment Mode"
          renderItem={(data) => (
            <>
              <List.Item title={data.item} />
              <Divider />
            </>
          )}
          onChange={() => {}}
        />
      </View>

      <View>
        <Dropdown
          style={[style.dropdownContainer, { borderWidth: 0.8, marginTop: 5 }]}
          selectedTextStyle={{
            fontSize: 13,
            color: colorList.dark,
          }}
          containerStyle={{
            marginTop: 8,
            borderRadius: 8,
            borderWidth: 0.8,
            borderBlockColor: colorList.Grey1,
          }}
          value={null}
          mode="default"
          data={[{ item: "item" }]}
          labelField="item"
          valueField="item"
          placeholder="Invoice No"
          renderItem={(data) => (
            <>
              <List.Item title={data.item} />
              <Divider />
            </>
          )}
          onChange={() => {}}
        />
      </View>

      <View>
        <TextInput
          mode="outlined"
          dense
          label="Amount"
          keyboardType="number-pad"
        />
      </View>

      <View style={{paddingBottom:10}}>
        <TextInput multiline mode="outlined" dense label="Instructions" />
      </View>
       </ScrollView>

      <View
        style={{
          display: "flex",
          gap: 4,
          paddingHorizontal: 5,
          paddingVertical: 6,
        }}
      >
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
            onPress={handleSaveReceipt}
            textColor={colorList.white}
            contentStyle={{
              backgroundColor: colorList.socondary,
              flexDirection: "row-reverse",
            }}
          >
            Save Receipt
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AddReceipt;
const style = StyleSheet.create({
  container: {
    height:Dimensions.get("screen").height-230,
    padding: 5,
    gap: 4,
    flexGrow: 1,
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
