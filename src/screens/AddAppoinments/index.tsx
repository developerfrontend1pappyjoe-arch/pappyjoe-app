import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-native-date-picker";
import { colorList } from "../../styles/global.styles";
import { Dropdown } from "react-native-element-dropdown";
import { getDoctersList } from "../../services/getDoctersLIst";
import moment from "moment";
// import axios from 'axios';
import { API_URL } from "../../utils/constants";
import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { CustomHeader } from "../../components/CustomHeader";
import { ArrowLeftIcon } from "../../assets";
import { NavigationList } from "../../routes/NavigationList";
import { axiosInstance } from "../../config/axios.config.custom";
import _ from "lodash";
import { getPatientService } from "../../services/getPatientList";
import React from "react";
import {
  ActivityIndicator,
  Divider,
  Icon,
  List,
  TextInput as PaperInput,
  Text as MetText
} from "react-native-paper";
type SearchResultType = {
  status: number;
  message: string;
  data: any[];
};
export const AddNewAppoinments = ({ navigation, route }: any) => {
  const axios = axiosInstance;
  const { data = "" } = route?.params || {};
  // console.log('appointmentDetails ==> ', data);
  const patientLoading = [{ Name: "Searching....." }];
  const paymentOptions = [
    { id: 1, Name: "Yes" },
    { id: 2, Name: "No" },
  ];

  const repeatDaysOptions = [
    { id: 1, Name: "0" },
    { id: 2, Name: "1" },
    { id: 3, Name: "2" },
    { id: 4, Name: "3" },
    { id: 5, Name: "4" },
    { id: 6, Name: "5" },
    { id: 7, Name: "6" },
    { id: 8, Name: "7" },
  ];
  const slotsOptions = [
    { id: 1, Name: "00:5:00" },
    { id: 2, Name: "00:10:00" },
    { id: 3, Name: "00:15:00" },
    { id: 4, Name: "00:20:00" },
    { id: 5, Name: "00:30:00" },
    { id: 6, Name: "01:00:00" },
    { id: 6, Name: "01:30:00" },
    { id: 6, Name: "02:00:00" },
  ];
  const [isLoading, setLoader] = useState(false);
  const [patientList, setPatientList] = useState<SearchResultType | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  // const [dropdownKey, setDropdownKey] = useState(0);

  // const [queueStatusList, setQueueStatusList] = useState([
  //   {id: 1, name: 'waiting', label: 'Waiting'},
  //   {id: 2, name: 'engage', label: 'Engage'},
  //   {id: 3, name: 'checkout', label: 'Checkout'},
  // ]);
  const [doctersList, setDoctersList] = useState([]);
  const [dateTimeModal, setDateTimeModal] = useState(false);
  const [searchField, setSearchField] = useState<string>("Name");
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    date: new Date(),
    time: new Date(),
    payment: paymentOptions[1],
    repeat: repeatDaysOptions[0],
    notes: "",
    slot: slotsOptions[3],
    queuestatus: "",
    phoneNUmber: "",
    mobile: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    patient_id: "",
    doctor_id: "",
    date: "",
    time: "",
    payment: "",
    repeat: "",
    notes: "",
    slot: "",
    queuestatus: "",
    mobile: "",
  });

  // useEffect(() => {
  //   getPatient();
  //   getDocters();
  // }, []);

  const handleChange = (field, value) => {
    if (field == "patient_id") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mobile: value.mobile,
        [field]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value,
      }));
    }

    setErrorMessages((prevErrorMessages) => ({
      ...prevErrorMessages,
      [field]: "",
    }));
  };

  const validateAndSubmit = () => {
    const requiredFields =
      data?.mode === "edit"
        ? [
            "doctor_id",
            "date",
            "time",
            // 'payment',
            // 'repeat',
            "slot",
            // 'queuestatus',
          ]
        : [
            "patient_id",
            "doctor_id",
            "date",
            "time",
            // 'payment',
            "repeat",
            "slot",
          ];

    let isValid = true;
    const newErrorMessages = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrorMessages[field] = "Field is required";
        isValid = false;
      } else {
        newErrorMessages[field] = "";
      }
    });

    if (moment(formData.date).add(1, "day").isBefore(moment())) {
      newErrorMessages["date"] = "Selected date must be in the future";
      isValid = false;
    }

    setErrorMessages(newErrorMessages);

    if (isValid) {
      // console.log('formData -----', formData);
      addPatientApi();
    }
  };

  // useEffect(() => {
  //   setDropdownKey(prevKey => prevKey + 1);
  // }, [patientList]);

  const getPatient = async (params = "") => {
    setSearchLoading(true);
    try {
      const { data } = await getPatientService({ search: params });
      data && setSearchLoading(false);
      setPatientList(data);
    } catch (err) {
      setSearchLoading(false);
      setPatientList(null);
    }
  };

  const searchResult = useMemo(() => {
    if (patientList?.data) {
      if (_.isEqual(patientList?.data, [[]])) {
        return [];
      } else {
        //  return Array.isArray(patientList?.data) ? patientList?.data : [patientList?.data]
        return patientList?.data;
      }
    } else {
      return [];
    }
  }, [patientList?.data, searchLoading]);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

 const debounceMethod =  debounce((text) => {
    if (text !== "") {
      const textType = !isNaN(text) && text.trim() !== "" ? "mobile" : "Name";
      setSearchField(textType);
      getPatient(text);
    }
  }, 100);

  const handleSearchChange = (text)=>{
    setSearchText(text);
    debounceMethod(text)
  }

  const addDocEditMode = () => {
    if (data?.mode === "edit") editModeDataFill();
  };

  const getDocters = async () => {
    try {
      const { data } = await getDoctersList();
      setDoctersList(data);
      // setTimeout(() => {
      //   addDocEditMode(data);
      // }, 50);
    } catch (err) {
      setDoctersList([]);
    }
  };

  const editModeDataFill = () => {
    // console.log('data?.data == Edit Apponment ===> ', data?.data);
    const temp = { ...formData };
    const docId = doctersList.filter(
      (el) => el.Name === data?.data?.Doctor_Name
    )[0];
    temp.doctor_id = docId;
    const dates = moment(data?.data?.Appointment_Date, "DD-MM-YYYY");
    const times = moment(data?.data?.Appointment_Time, "HH:mm a");
    const dateTime = dates.add(times.hours(), "hours").add(times.minute(), "minutes");
    temp.date = dates.toDate();
    temp.time = dateTime;
    temp.notes = data?.data?.Appointment_Notes == "0" ? "" : data?.data?.Appointment_Notes;
    temp.mobile = data?.data?.Patient_mobile ? data?.data.Patient_mobile : "" 
    console.log(data);
    setFormData(temp);
  };

useEffect(()=>{
  addDocEditMode()
},[doctersList])

  const addPatientApi = async () => {
    setLoader(true);
    const formDetails = new FormData();

    if (data?.mode !== "edit")
      formDetails.append("patient_id", formData?.patient_id?.id);
    formDetails.append("doctor_id", formData?.doctor_id?.doctorid);
    formDetails.append("date", moment(formData?.date).format("YYYY-MM-DD"));
    formDetails.append("time", moment(formData.date).format("HH:mm"));
    formDetails.append("payment", formData?.payment?.Name);
    formDetails.append("repeat", formData?.repeat?.Name);
    if (formData?.notes?.trim() !== "")
      formDetails.append("notes", formData?.notes?.trim());
      formDetails.append("slot", formData?.slot?.Name);
    if (data?.mode === "edit") {
      formDetails.append("app_id", data?.data?.Appointment_Id);
    }
   console.log(formDetails)
    try {
      if (data?.mode === "edit") {
        const res = await axios.put(API_URL.fixAppointment, formDetails, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res?.status === 200) {
          setLoader(false);
          setTimeout(() => {
            Alert.alert("Success", res?.data?.message || "Added Successfully", [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate(NavigationList.homeBottomNav, {
                    reload: true,
                  }),
              },
            ]);
          }, 10);
        } else {
          setLoader(false);
          Alert.alert(
            res.data?.message || "Somthing went wrong,please try agin later"
          );
        }
      } else {
        const res = await axios.post(API_URL.addAppoinments, formDetails, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.status === 200) {
          setLoader(false);
          setTimeout(() => {
            Alert.alert("Success", res?.data?.message || "Added Successfully", [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate(NavigationList.homeBottomNav, {
                    reload: true,
                  }),
              },
            ]);
          }, 10);
        } else {
          setLoader(false);
          Alert.alert(
            res.data?.message || "Somthing went wrong,please try agin later"
          );
        }
      }
    } catch (err) {
      setLoader(false);
      // console.error('Errr in post patient details', err.response.data);
      Alert.alert("Error", err?.response?.data?.message);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
  };

useEffect(()=>{
getPatient()
getDocters()
return ()=>{
   setDoctersList([])
   setPatientList(null)
}
},[])
  const renderDropdownItem = (item: any, index: number) => {
    return (
      <React.Fragment key={index}>
        <List.Item
          title={`${item?.Name} ${item?.age ? ("| " + item?.age) : ""} ${item?.gender ? (item?.gender != "0" ? `| ${item?.gender}` : "") : ""}`}
          description={`Mob: ${item?.mobile}`}
          right={(props) => <MetText variant="labelSmall" {...props}>({item?.Patient_Id})</MetText>}
        />
        <Divider />
      </React.Fragment>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorList.white }}>
      <CustomHeader
        headerText={data?.mode ? "Edit Appointment" : "Add New Appointment"}
        leftIcon={ArrowLeftIcon}
        leftIconAction={() =>
          data?.mode
            ? navigation.navigate(NavigationList.homeBottomNav)
            : navigation.goBack()
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {isLoading ? (
          <CustomLoaderRound />
        ) : (
          <ScrollView style={[styles.container, { flex: 1 }]}>
            {data?.mode !== "edit" && (
              <View>
                <Dropdown
                  mode="default"
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.dropdownContainerStyle}
                  itemTextStyle={styles.dropdownItemTextStyle}
                  data={searchResult || []}
                  maxHeight={300}
                  labelField="Name"
                  valueField="Name"
                  searchField={searchField}
                  placeholder={"Patients"}
                  searchPlaceholder={"Search..."}
                  search
                  value={formData?.patient_id || ""}
                  onChange={(item) => handleChange("patient_id", item)}
                  // onChangeText={handleSearchChange}
                  renderItem={renderDropdownItem}
                  renderInputSearch={(onChange) => (
                    <PaperInput
                      value={searchText}
                      mode="outlined"
                      outlineStyle={{ borderColor: colorList.primary }}
                      onChangeText={handleSearchChange}
                      style={{ margin: 3, height: 50 }}
                      right={
                        <PaperInput.Affix
                          text={
                            searchLoading ? (
                              <ActivityIndicator
                                color={colorList.primary}
                                size={22}
                              />
                            ) : (
                            <TouchableOpacity onPress={clearSearchText}>
                              <Icon size={20} source="close"/>
                            </TouchableOpacity>
                            )
                          }
                        />
                      }
                    />
                  )}
                />

                {errorMessages["patient_id"] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages["patient_id"]}
                  </Text>
                )}
              </View>
            )}

            <View>
              {/* <Text style={styles.label}>Doctors</Text> */}
              <Dropdown
                onFocus={()=>{getDocters()}}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.dropdownContainerStyle}
                itemTextStyle={styles.dropdownItemTextStyle}
                data={doctersList || []}
                maxHeight={300}
                labelField="Name"
                valueField="Name"
                placeholder="Doctor"
                searchPlaceholder="Search..."
                search
                value={formData?.doctor_id}
                onChange={(item) => handleChange("doctor_id", item)}
              />
              {errorMessages["doctor_id"] && (
                <Text style={styles.errorMessage}>
                  {errorMessages["doctor_id"]}
                </Text>
              )}
            </View>

            <View>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                placeholder="Phone Number"
                value={formData?.mobile}
                onChangeText={(text) => handleChange("mobile", text)}
                multiline
                style={[styles.input, { height: 50 }]}
              />
              {errorMessages["mobile"] && (
                <Text style={styles.errorMessage}>
                  {errorMessages["mobile"]}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ marginRight: 10, flex: 1 }}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  value={moment(formData?.date).format("DD-MM-YYYY")}
                  onPressIn={() => setDateTimeModal(true)}
                  placeholder="Date"
                  style={[styles.input, { height: 50 }]}
                />
                {errorMessages["date"] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages["date"]}
                  </Text>
                )}
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  value={moment(formData?.time).format("hh:mm A")}
                  onPressIn={() => setDateTimeModal(true)}
                  placeholder="Time"
                  style={[styles.input, { height: 50 }]}
                />
                {errorMessages["time"] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages["time"]}
                  </Text>
                )}
              </View>
            </View>
            <DatePicker
              modal
              open={dateTimeModal}
              date={formData?.date}
              minimumDate={new Date()}
              // minuteInterval={5}
              onConfirm={(date) => {
                setDateTimeModal(false);
                handleChange("date", date);
                handleChange("time", date);
              }}
              onCancel={() => setDateTimeModal(false)}
            />
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Slots :</Text>
                <Dropdown
                  mode="modal"
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.dropdownContainerStyle}
                  itemTextStyle={styles.dropdownItemTextStyle}
                  data={slotsOptions}
                  maxHeight={300}
                  labelField="Name"
                  valueField="Name"
                  placeholder="Slots"
                  value={formData?.slot}
                  onChange={(item) => handleChange("slot", item)}
                />
                {errorMessages["slot"] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages["slot"]}
                  </Text>
                )}
              </View>
              {/* <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Payment :</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.dropdownContainerStyle}
                  itemTextStyle={styles.dropdownItemTextStyle}
                  data={paymentOptions}
                  maxHeight={300}
                  labelField="Name"
                  valueField="Name"
                  placeholder="Payment Option"
                  value={formData?.payment}
                  onChange={item => handleChange('payment', item)}
                />
                {errorMessages['payment'] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages['payment']}
                  </Text>
                )}
              </View> */}

              {data?.mode !== "edit" && (
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.label}>Repeat :</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    containerStyle={styles.dropdownContainerStyle}
                    itemTextStyle={styles.dropdownItemTextStyle}
                    data={repeatDaysOptions}
                    maxHeight={300}
                    labelField="Name"
                    valueField="Name"
                    placeholder="Repeat"
                    value={formData?.repeat}
                    onChange={(item) => handleChange("repeat", item)}
                  />
                  {errorMessages["repeat"] && (
                    <Text style={styles.errorMessage}>
                      {errorMessages["repeat"]}
                    </Text>
                  )}
                </View>
              )}
            </View>

            <Text style={styles.label}>Notes</Text>
            <TextInput
              placeholder="Notes"
              value={formData?.notes}
              onChangeText={(text) => handleChange("notes", text)}
              multiline
              style={[styles.input, { height: 100 }]}
            />
            {errorMessages["notes"] && (
              <Text style={styles.errorMessage}>{errorMessages["notes"]}</Text>
            )}

            {/* {data?.mode === 'edit' && (
              <View>
                <Text style={styles.label}>Queue Status</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  containerStyle={styles.dropdownContainerStyle}
                  itemTextStyle={styles.dropdownItemTextStyle}
                  data={queueStatusList}
                  maxHeight={300}
                  labelField="label"
                  valueField="name"
                  placeholder="Status"
                  // searchPlaceholder="Search..."
                  // search
                  value={formData?.queuestatus}
                  onChange={item => handleChange('queuestatus', item)}
                />
                {errorMessages['queuestatus'] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages['queuestatus']}
                  </Text>
                )}
              </View>
            )} */}

            <TouchableOpacity
              onPress={validateAndSubmit}
              style={{
                backgroundColor: colorList.primary,
                padding: 10,
                borderRadius: 8,
                marginVertical: 15,
              }}
            >
              <Text style={{ color: colorList.white, textAlign: "center" }}>
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        {/* </ScrollView> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color: colorList.Black,
  },
  input: {
    height: 40,
    borderColor: colorList.Grey4,
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: colorList.Black,
  },
  errorMessage: {
    color: "red",
    marginBottom: 5,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  rowContainer: {
    flexDirection: "row",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    fontSize: 14,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: "400",
    color: colorList.dark,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: "400",
    color: colorList.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 16,
    // borderWidth: 0.5,
    borderRadius: 8,
    // paddingLeft: 10,
    // marginTop: 16,
    color: colorList.dark,
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
    borderRadius: 5,
    marginTop: 5,
    paddingBottom: 5,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colorList.red,
  },
});
