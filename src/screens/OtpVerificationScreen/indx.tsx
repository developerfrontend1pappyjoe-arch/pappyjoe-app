import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { CustomButton } from "../../components/CustomButton";
import { NavigationList } from "../../routes/NavigationList";
import { styles } from "./otpVerification.styles";
import { CustomHeaderDesc } from "../../components/CustomHeaderDesc";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../../utils/constants";
import { useToast } from "react-native-toast-notifications";
import { ToasterTypes } from "../../styles/global.styles";
import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { axiosInstance as axios } from "../../config/axios.config.custom";

const OTPVerificationHeaderImage = require("../../assets/OTPVverificationScreen/OTPVerificationImage.png");
export const OTPVerificationScreen = ({
  navigation,
  route: {
    params: { data },
  },
  ...rest
}: any) => {
  const toast = useToast();

  const checkOTPVerification = async (payload: any) => {
    const res = await axios.post(API_URL.verifyOtp, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  };

  const { mutate, isLoading, error } = useMutation({
    mutationFn: checkOTPVerification,
    onSuccess: (res: any) => {
      console.log("Ressss", res.data);
      toast.show("Successfull...!!!", {
        type: ToasterTypes.success,
      });
      setTimeout(() => {
        navigation.navigate(NavigationList.otpSuccess, { data });
      }, 1500);
    },
    onError: (err: any) => {
      console.log("Errrrr", err.response.data.message);
      toast.show(err.response.data.message, {
        type: ToasterTypes.error,
      });
    },
  });

  const [otp, setOtp] = useState("");

  const handleVerify = (code: string) => {
    const formData = new FormData();
    if (typeof code == "string") {
      formData.append("otp", code);
    } else {
      formData.append("otp", otp);
    }
    formData.append("mobileno", `${data?.phoneNumber}`);
    console.log(formData);
    mutate(formData);
  };

  const handleChangeOtp = (code: string) => {
    setOtp(code);
  };

  const extractOtpFromMessage = (message: string) => {
    const otpRegex = /\d+/;
    const match = message.match(otpRegex);
    if (match) {
      return match[0];
    }
    return "";
  };


  return (
    <>
      <View style={styles.imageContainer}>
        <Image source={OTPVerificationHeaderImage} style={styles.bgImage} />
      </View>
      <View style={styles.formContainer}>
        <CustomHeaderDesc
          headerText="Security Verification"
          desc={`Enter the 7 digit code we've sent to your mobile +${data?.country} ${data?.phoneNumber} `}
        />

        <TouchableOpacity style={styles.resendBtnContainer}>
          <Text style={styles.resendBtn}>Resend</Text>
        </TouchableOpacity>

        <View style={styles.otpInputContainer}>
          <OTPInputView
            style={{ width: "100%", height: 200 }}
            pinCount={7}
            code={otp}
            onCodeChanged={handleChangeOtp}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.otpInput}
            codeInputHighlightStyle={styles.otpInputHighlighted}
            onCodeFilled={handleVerify}
            editable
            keyboardAppearance="default"
            keyboardType="number-pad"
          />
        </View>

        {isLoading ? (
          <CustomLoaderRound />
        ) : (
          <CustomButton
            btnName="Verify"
            navigate={handleVerify}
            bgStyles={styles.registerBtnBgStyle}
          />
        )}

        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => navigation.navigate(NavigationList.login)}
          style={styles.LoginBtnContainer}
        >
          <Text style={styles.loginLabel1}>Have an account?</Text>
          <Text style={styles.loginLabel2}>Login</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
