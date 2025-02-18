import React, { useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardTypeOptions,
} from "react-native";

import { Button, Divider, Menu, Text, TextInput } from "react-native-paper";
import { colorList } from "../../styles/global.styles";
// import axios from 'axios';
import { API_URL } from "../../utils/constants";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { CustomHeader } from "../../components/CustomHeader";
import { ArrowLeftIcon } from "../../assets";
import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { axiosInstance } from "../../config/axios.config.custom";
import { CameraViews } from "../AppoinmentsDetailsScreen/components/files/CameraViews";
type ErrorMessageObjectType = {
  name: string;
  // owner: '',
  email: string;
  country_code: string;
  mobile: string;
  gender: string;
  age: string;
  dob: string;
  fileno: string;
  // patientId: '',
  address: string;
};
export const AddPatients = ({ navigation }: any) => {
  const axios = axiosInstance;
  const genderOptions = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
  ];
  const [formData, setFormData] = useState({
    name: "",
    // owner: '',
    email: "",
    country_code: "91",
    mobile: "",
    gender: "",
    age: "",
    dob: "",
    fileno: "",
    // patientId: '',
    address: "",
  });

  const [errorMessages, setErrorMessages] = useState<
    ErrorMessageObjectType | ""
  >({
    name: "",
    // owner: '',
    email: "",
    country_code: "",
    mobile: "",
    gender: "",
    age: "",
    dob: "",
    fileno: "",
    // patientId: '',
    address: "",
  });

  const [dateTimeModal, setDateTimeModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const validateEmail = (email: string): string | null => {
    if (!email) {
      return "Email is required.";
    }
    if (/\s/.test(email)) {
      return "Email cannot contain spaces.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format. Please enter a valid email (e.g., example@domain.com).";
    }
    return null; // Valid email, no error message
  };

  const handleChange = (field: string, value: any) => {
    if (field == "country_code") {
      if (value.includes("+")) {
        const correctedValue = value.replace(/\+/g, "");
        setFormData({ ...formData, [field]: correctedValue });
      } else {
        setFormData({ ...formData, [field]: value });
      }
      setErrorMessages({
        ...(errorMessages as ErrorMessageObjectType),
        [field]: "",
      });
      return;
    }
    if (field === "dob") {
      const birthDate = moment(value);
      const currentDate = moment();
      const duration = moment.duration(currentDate.diff(birthDate));
      const years = duration.years();
      setFormData({ ...formData, age: years.toString(), [field]: value });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    setErrorMessages({
      ...(errorMessages as ErrorMessageObjectType),
      [field]: "",
    });
  };

  const handleInputValidation = (field: string) => {
    if (field == "email") {
      const value = formData[field];
      const errorMsg = validateEmail(value);
      if (errorMsg) {
        setErrorMessages({
          ...(errorMessages as ErrorMessageObjectType),
          [field]: errorMsg,
        });
      }
    }
  };

  const validateAndSubmit = () => {
    const requiredFields = ["name", "country_code", "mobile"];

    let isValid = true;
    const newErrorMessages: any = {};

    requiredFields.forEach((field: string) => {
      if (!formData[field as keyof typeof formData]) {
        newErrorMessages[field as keyof typeof newErrorMessages] = `* required`;
        isValid = false;
      } else {
        newErrorMessages[field as keyof typeof newErrorMessages] = "";
      }
    });
    setErrorMessages(newErrorMessages);

    if (isValid) {
      addPatientApi();
    }
  };

  const addPatientApi = async () => {
    setLoading(true);
    const formDetails = new FormData();

    Object.entries(formData).map(([key, val]: any[]) => {
      if (key == "gender") {
        const gender = val ? val?.name : val;
        formDetails.append(`${key}`, `${gender}`);
      } else formDetails.append(`${key}`, `${val}`);
    });
    // console.log(formDetails);
    try {
      const res = await axios.post(API_URL.addPatient, formDetails, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res && res.status === 200) {
        setLoading(false);
        // console.log('Resss', res.data);
        Alert.alert("Success", res?.data?.message || "Added Successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        setLoading(false);
        Alert.alert("Error", res?.data?.message || "Somthing went wrong");
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Errr in post patient details", err.response.data);
      Alert.alert("Error", err?.response?.data?.message);
    }
  };

  const renderField = (
    label: string,
    field: keyof typeof formData,
    keyboardType: KeyboardTypeOptions = "default"
  ) => (
    <View style={styles.fieldContainer}>
      <TextInput
        mode="outlined"
        label={label}
        style={styles.input}
        onChangeText={(text) => handleChange(field, text)}
        onBlur={() => handleInputValidation(field)}
        value={formData[field]}
        keyboardType={keyboardType as KeyboardTypeOptions}
      />
      {errorMessages !== "" && errorMessages[field] && (
        <Text style={styles.errorMessage}>{errorMessages[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colorList.white }}>
        <CustomHeader
          headerText="Add New Patient"
          leftIcon={ArrowLeftIcon}
          leftIconAction={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderField("Name", "name")}
            {renderField("Email", "email", "email-address")}

            <View style={styles.rowContainer}>
              <View style={{ flex: 4, marginRight: 10 }}>
                {renderField("Code", "country_code", "number-pad")}
              </View>
              <View style={{ flex: 8 }}>
                {renderField("Mobile", "mobile", "phone-pad")}
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                  justifyContent: "center",
                }}
              >
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  containerStyle={{ backgroundColor: colorList.Grey6 }}
                  itemTextStyle={styles.dropdownItemTextStyle}
                  data={genderOptions}
                  maxHeight={300}
                  labelField="name"
                  valueField="name"
                  placeholder="Gender"
                  value={formData?.gender}
                  onChange={(item) => handleChange("gender", item)}
                />
                {errorMessages["gender" as keyof typeof errorMessages] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages["gender" as keyof typeof errorMessages]}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                {renderField("Age", "age", "number-pad")}
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ marginRight: 10, flex: 1, marginVertical: 10 }}>
                <Text variant="titleSmall" style={{ marginBottom: 5 }}>
                  DOB
                </Text>
                <TextInput
                  mode="outlined"
                  value={
                    formData?.dob != ""
                      ? moment(formData?.dob).format("DD-MM-YYYY")
                      : formData?.dob.toString()
                  }
                  onPressIn={() => setDateTimeModal(true)}
                  placeholder="DD-MM-YYYY"
                  style={[styles.input]}
                />
                {errorMessages["dob" as keyof typeof errorMessages] && (
                  <Text style={styles.errorMessage}>
                    {errorMessages["dob" as keyof typeof errorMessages]}
                  </Text>
                )}
              </View>
            </View>
            <DatePicker
              modal
              mode="date"
              open={dateTimeModal}
              date={formData?.dob == "" ? new Date() : new Date(formData?.dob)}
              maximumDate={new Date()}
              onConfirm={(date) => {
                setDateTimeModal(false);
                handleChange("dob", date);
              }}
              onCancel={() => setDateTimeModal(false)}
            />

            {renderField("File Number", "fileno")}
            {renderField("Address", "address")}

            {isLoading ? (
              <CustomLoaderRound />
            ) : (
              <TouchableOpacity
                onPress={validateAndSubmit}
                style={{
                  backgroundColor: colorList.primary,
                  padding: 10,
                  borderRadius: 8,
                  marginVertical: 10,
                }}
              >
                <Text style={{ color: colorList.white, textAlign: "center" }}>
                  Submit
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colorList.Black,
  },
  input: {
    height: 40,
    // borderColor: colorList.Grey4,
    // borderWidth: 1,
    // marginBottom: 5,
    // paddingHorizontal: 10,
    paddingLeft: 0,
    borderRadius: 8,
    color: colorList.Black,
    backgroundColor: colorList.white,
  },
  errorMessage: {
    color: "red",
    marginBottom: 5,
  },
  fieldContainer: {
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },

  dropdown: {
    height: 40,
    borderColor: colorList.GreyDark1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
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
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
  },
});
