import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Divider, List, Text, TextInput } from "react-native-paper";
import { colorList } from "styles/global.styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFinaceMaster, getInvoiceList, saveReceipt } from "screens/Billing/services";
import { useDispatch, useSelector } from "react-redux";
import { StoreTypes } from "redux/reducer";
import { useToast } from "react-native-toast-notifications";
import { closeBillingModal, editInvoiceList } from "redux/actions";
const AddReceipt = () => {
  const [startDateModal, setStartDateModal] = useState<boolean>();
  const toast = useToast()
  const [receiptData, setReceiptData] = useState({
    dates: new Date(),
    amountpaid: "",
    paytype: { paytype: "Invoice Payment" },
    paymode: null,
    inoiceno: null,
    instruction: "",
  });

  const [errorStatus, setErrorStatus] = useState({
    error: false,
    dates: errorMessage.dates.required ? errorMessage.dates.message : "",
    amountpaid: errorMessage.amountpaid.required
      ? errorMessage.amountpaid.message
      : "",
    paytype: "",
    paymode: errorMessage.paymode.required ? errorMessage.paymode.message : "",
    inoiceno: errorMessage.inoiceno.message,
    instruction: errorMessage.instruction.required
      ? errorMessage.instruction.message
      : "",
  });

  const { patientDetails, billing } = useSelector<any>(
    (state) => state
  ) as StoreTypes;

  const queryClient = useQueryClient();
   const {data:financeData} = useQuery(["financeMasterInReceipt"], getFinaceMaster, {
     onError: (e: any) => {
       toast.show(e.message || "Something error!", {
         type: "warning",
       });
     },
   });
const dispatch = useDispatch()
  const { mutate, data, isLoading } = useMutation(getInvoiceList);

  const { mutate:save, isLoading:saveLoading } = useMutation(saveReceipt,{
    onSuccess:(result)=>{
       if(result.status >= 200 || result.status < 300){
        toast.show(result?.message || "",{
          type:"success"
        })
        dispatch(closeBillingModal())
        dispatch(editInvoiceList([]))
       }else{
        toast.show(result?.message || "",{
          type:"error"
        })
       }
    },
    onError:(error:any)=>{
      toast.show(error?.response?.data?.message || "Something went wrong!",{
        type:"error"
      })
    }
  });

  const checkValidation = (field: string, value: any) => {
    if (errorMessage[field as keyof typeof errorMessage].required) {
      if (Boolean(value)) {
        if (field == "paytype") {
          if (
            (value.paytype == "Invoice Payment" ||
              value.paytype == "Invoice Refund") &&
            receiptData.inoiceno == null
          ) {
            setErrorStatus((prev: any) => ({
              ...prev,
              inoiceno: errorMessage.inoiceno.message,
            }));
          } else {
            setErrorStatus((prev: any) => ({
              ...prev,
              inoiceno: "",
            }));
          }
        }
        setErrorStatus((prev: any) => ({
          ...prev,
          [field]: "",
        }));
      } else {
        setErrorStatus((prev: any) => ({
          ...prev,
          [field]: errorMessage[field as keyof typeof errorMessage].message,
        }));
      }
    } else {
      setErrorStatus((prev: any) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    checkValidation(field, value);
    setReceiptData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInvoiceChange = (value: any) => {
    checkValidation("inoiceno", value);
    checkValidation("amountpaid", value);
    setReceiptData((prev: any) => ({
      ...prev,
      inoiceno: value,
      amountpaid: value?.invoiceBalance,
    }));
  };

  const handleSaveReceipt = () => {
    let isError = 0;
    for (let key in errorStatus) {
      if (key != "error" && errorStatus[key] != "") {
        isError++;
      }
    }
    if (isError > 0) {
      setErrorStatus((prev) => ({
        ...prev,
        error: true,
      }));
    } else {
      const formData = new FormData();
      formData.append("dates", moment(receiptData.dates).format("YYYY-MM-DD"));
      formData.append("patient_id", patientDetails?.id || "");
      formData.append("paytype", receiptData?.paytype.paytype || "");
      formData.append("paymode", receiptData?.paymode?.state || "");
      if (
        receiptData?.paytype.paytype == "Invoice Refund" ||
        receiptData?.paytype.paytype == "Invoice Payment"
      ) {
        formData.append("inoiceno", receiptData?.inoiceno?.invoiceNo || "");
      }
      formData.append("amountpaid", receiptData?.amountpaid || "");
      formData.append("instruction", receiptData?.instruction || "");
      console.log(formData);
      save(formData);
    }
  };

  useEffect(() => {
    if (Boolean(patientDetails?.id)) {
      mutate({ id: patientDetails?.id as string, unpaid: true });
    }
  }, []);
  // useEffect(()=>{
  //  console.log("cachedData========>",financeData)
  // },[financeData])
  return (
    <View>
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
              error={Boolean(errorStatus.dates && errorStatus.error)}
              mode="outlined"
              editable={false}
              value={moment(receiptData.dates).format("DD-MM-YYYY")}
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
            date={receiptData.dates}
            style={{ backgroundColor: colorList.white }}
            onConfirm={(date) => {
              setStartDateModal(false);
              handleFieldChange("dates", date);
            }}
            onCancel={() => setStartDateModal(false)}
          />
          {Boolean(errorStatus.dates && errorStatus.error) && (
            <Text
              variant="labelSmall"
              style={{ color: colorList.palette.error.main }}
            >
              {errorMessage.dates.message}
            </Text>
          )}
        </View>

        <View>
          <Dropdown
            style={[
              style.dropdownContainer,
              Boolean(errorStatus.paytype && errorStatus.error)
                ? style.dropdownError
                : style.dropdownNormal,
            ]}
            selectedTextStyle={style.selectedTextStyle}
            containerStyle={{
              marginTop: 8,
              borderRadius: 8,
              borderWidth: 0.8,
              borderColor: colorList.Grey1,
            }}
            value={receiptData.paytype}
            mode="default"
            data={paymentType}
            labelField="paytype"
            valueField="paytype"
            placeholder="Instrument Type"
            renderItem={(data) => (
              <>
                <List.Item title={data.paytype} />
                <Divider />
              </>
            )}
            onChange={(value) => {
              handleFieldChange("paytype", value);
            }}
          />
          {Boolean(errorStatus.paytype && errorStatus.error) && (
            <Text
              variant="labelSmall"
              style={{ color: colorList.palette.error.main }}
            >
              {errorMessage.paytype.message}
            </Text>
          )}
        </View>

        <View>
          <Dropdown
            style={[
              style.dropdownContainer,
              Boolean(errorStatus.paymode && errorStatus.error)
                ? style.dropdownError
                : style.dropdownNormal,
            ]}
            selectedTextStyle={style.selectedTextStyle}
            containerStyle={{
              marginTop: 10,
              borderRadius: 8,
              borderWidth: 0.8,
              borderBlockColor: colorList.Grey1,
            }}
            value={receiptData.paymode}
            mode="default"
            data={financeData?.data?.paymode || []}
            labelField="state"
            valueField="state"
            placeholder="Payment Mode"
            renderItem={(data) => (
              <>
                <List.Item title={data?.state || ""} />
                <Divider />
              </>
            )}
            onChange={(value) => {
              handleFieldChange("paymode", value);
            }}
          />
          {Boolean(errorStatus.paymode && errorStatus.error) && (
            <Text
              variant="labelSmall"
              style={{ color: colorList.palette.error.main }}
            >
              {errorMessage.paymode.message}
            </Text>
          )}
        </View>

        <View>
          <Dropdown
            style={[
              style.dropdownContainer,
              Boolean(errorStatus.inoiceno && errorStatus.error)
                ? style.dropdownError
                : style.dropdownNormal,
            ]}
            selectedTextStyle={[style.selectedTextStyle, { fontSize: 12 }]}
            containerStyle={{
              marginTop: 8,
              borderRadius: 8,
              borderWidth: 0.8,
              borderBlockColor: colorList.Grey1,
            }}
            value={receiptData.inoiceno}
            mode="default"
            data={data || []}
            labelField="displayText"
            valueField="invoiceNo"
            placeholder="Invoice No"
            renderItem={(data) => (
              <>
                <Text
                  style={{
                    fontSize: 13,
                    paddingVertical: 15,
                    paddingHorizontal: 8,
                  }}
                >
                  {data?.displayText || ""}
                </Text>
                <Divider />
              </>
            )}
            onChange={handleInvoiceChange}
          />
          {Boolean(errorStatus.inoiceno && errorStatus.error) && (
            <Text
              variant="labelSmall"
              style={{ color: colorList.palette.error.main }}
            >
              {errorMessage.inoiceno.message}
            </Text>
          )}
        </View>

        <View>
          <TextInput
            style={[{ marginTop: 5 }]}
            error={Boolean(errorStatus.amountpaid && errorStatus.error)}
            value={receiptData.amountpaid}
            mode="outlined"
            dense
            label="Amount"
            keyboardType="number-pad"
            onChangeText={(value) => {
              handleFieldChange("amountpaid", value);
            }}
          />
          {Boolean(errorStatus.amountpaid && errorStatus.error) && (
            <Text
              variant="labelSmall"
              style={{ color: colorList.palette.error.main }}
            >
              {errorMessage.amountpaid.message}
            </Text>
          )}
        </View>

        <View style={{ paddingBottom: 10 }}>
          <TextInput
            style={{ marginTop: 5 }}
            value={receiptData.instruction}
            multiline
            mode="outlined"
            dense
            label="Instructions"
            onChangeText={(value) => {
              handleFieldChange("instruction", value);
            }}
          />
          {Boolean(errorStatus.instruction && errorStatus.error) && (
            <Text
              variant="labelSmall"
              style={{ color: colorList.palette.error.main }}
            >
              {errorMessage.instruction.message}
            </Text>
          )}
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
            loading={saveLoading}
            disabled={saveLoading}
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
    height: Dimensions.get("screen").height - 230,
    padding: 5,
    gap: 8,
    flexGrow: 1,
  },
  cardStyle: {
    backgroundColor: colorList.white,
    padding: 10,
  },
  dropdownContainer: {
    backgroundColor: colorList.white,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 10,
    paddingVertical: 3,
  },
  dropdownNormal: {
    borderWidth: 1,
    borderColor: colorList.Black,
  },
  dropdownError: {
    borderWidth: 2,
    borderColor: colorList.palette.error.main,
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
  selectedTextStyle: {
    fontSize: 16,
    color: colorList.dark,
  },
});

const paymentType = [
  { paytype: "Invoice Payment" },
  { paytype: "Invoice Refund" },
  { paytype: "Wallet Recharge" },
  { paytype: "Wallet Refund" },
];

const errorMessage = {
  dates: { required: false, message: "Date required" },
  amountpaid: { required: true, message: "Amount required" },
  paytype: { required: true, message: "Instrument Type required" },
  paymode: { required: true, message: "Payment Mode required" },
  inoiceno: { required: false, message: "Invoice No required" },
  instruction: { required: false, message: "Instructions required" },
};
