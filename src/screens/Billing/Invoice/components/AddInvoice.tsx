import moment from "moment";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import {
  Button,
  TextInput,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
import AddInvoiceForm from "./AddInvoiceForm";
import { useDispatch, useSelector } from "react-redux";
import { editInvoiceList } from "redux/actions";
import { initialData, InvoiceSaveObjectType } from "../types";

function AddInvoice() {
  const [startDateModal, setStartDateModal] = useState<boolean>();
  const [startDate, setStartDate] = useState(new Date());
  const invoiceEditList = useSelector((state: any) => state.billing.invoiceEditList) || [];
   const dispatch = useDispatch();
   const handleAddInvoice = ()=>{
    // console.log([...invoiceEditList,initialData])
    dispatch(editInvoiceList([...invoiceEditList,initialData]))
   }
  
   const handleDelete = (index:number)=>{
    const updated = [...invoiceEditList].filter((_,i)=>i!=index)
    dispatch(editInvoiceList(updated))
   }

   const handleEdit = (params:{index:number,data:InvoiceSaveObjectType})=>{
    const updated = [...invoiceEditList]
    updated[params.index] = params.data
    dispatch(editInvoiceList(updated))
   }

  useEffect(() => {
    dispatch(
      editInvoiceList([initialData])
    );
  }, []);
  return (
    <View style={style.container}>
      <View style={{ display: "flex", gap: 4 }}>
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
          keyboardShouldPersistTaps="handled"
          data={invoiceEditList}
          renderItem={({ item, index }) => (
            <>
              <AddInvoiceForm handleEdit={handleEdit} handleDelete={handleDelete} index={index} item={item} />
            </>
          )}
        />
        <View style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end"}}>
            <Button
            onPress={handleAddInvoice}
            compact
            textColor={colorList.white}
            contentStyle={{ backgroundColor: colorList.socondary, flexDirection: 'row-reverse' }}
            icon="plus"
            >
            ADD
            </Button>
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
