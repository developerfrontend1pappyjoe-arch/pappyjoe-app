import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  Platform,
} from "react-native";

import { styles } from "../home.style";
import {
  ProfileAvatar,
} from "../../../assets";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colorList } from "../../../styles/global.styles";
import { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { updateQueueStatus } from "../../../services/updateQueueStatus";
import { CustomLoaderRound } from "../../../components/CustomLoaderRound";

import { API_URL } from "../../../utils/constants";
import {
  Text,
  Surface,
  Portal,
  Modal,
  TextInput,
  Button,
} from "react-native-paper";
import { axiosInstance as axios } from "../../../config/axios.config.custom";
import { checkCountryCode } from "utils/commonUtils";
import { useMutation } from "@tanstack/react-query";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import  MetrialIcon from "react-native-vector-icons/MaterialIcons";
export const AppoinmentList = ({ data, navigate, refetch }: any) => {
  const [isCancelNote, setIsCancelNote] = useState(false);
  const [cancelNote, setCancelNote] = useState("");

  const  {mutate,isLoading} = useMutation(updateQueueStatus,{
    onSuccess:(result)=>{
      if (result?.status == 200) {
          setQueueModal(false);
          setIsCancelNote(false);
          
          cancelNote !="" ?   Alert.alert("Success", result?.message, [
            {
              text: "Ok",
              onPress: () => refetch(),
            },
          ]) : refetch();
        } else {
          Alert.alert("Warning", result?.message || "Somthing went wrong", [
            {
              text: "Ok",
            },
          ]);
        }
    },
    onError:(err:any)=>{
      setQueueModal(false);
      setIsCancelNote(false);
      Alert.alert("Error", err?.response?.data?.message  || "Something went wrong !");
    }
  }
)

  const openDialer = () =>
    Linking.openURL(
      `tel:+${checkCountryCode(data?.Patient_country_code)}${data?.Patient_Mobile}`
    );

  const openWhatsApp = () => {
    try {
      Linking.openURL(
        `whatsapp://send?text=Hai&phone=${data?.Patient_country_code}${data?.Patient_Mobile}`
      );
    } catch (err) {
      console.error("err ===== ", err);
      Alert.alert("No Whatsapp Found");
    }
  };

  const handlZoomLinkApi = (data: any) => {
    try {
      const Url = `${API_URL.getZoomLink}?pid=${data?.Patient_Id}`;
      axios
        .get(Url)
        .then((res) => {
          if (res.data?.status == 200) {
            Linking.openURL(`${res.data?.data[0]?.url}`);
          }
          // console.log('Rewsss Dataaaa', res?.data);
        })
        .catch((err) => {
          Alert.alert("Error", err?.response?.data?.message);
        });
    } catch (err) {
      console.error("error in handlZoomLinkApi", err);
    }
  };

  const [openQueueModal, setQueueModal] = useState(false);
  const queueStatusList = [
    { id: 1, name: "waiting", label: "Waiting" },
    { id: 2, name: "engage", label: "Engage" },
    { id: 3, name: "checkout", label: "Checkout" },
  ];

  const handleChangeQueueStatus = (status: string) => {
    const formData = new FormData();
    formData.append("app_id", data?.Appointment_Id);
    formData.append("queuestatus", status);
    mutate({payload:formData,method:"put"})
  };

  const handleCancelAppoinmentsApi = () => {
    setIsCancelNote(false);
    const formData = new FormData();
    formData.append("app_id", data?.Appointment_Id);
    formData.append("reason", cancelNote);
    mutate({payload:formData,method:"delete"})
  };

  const handleCancelAppoinments = () => {
    Alert.alert(
      "Warning",
      "Are you sure, you want to cancel this Appointment ?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Confirm",
          onPress: () => setIsCancelNote(true),
        },
      ]
    );
  };

  return (
    <>
      {isLoading ? (
        <CustomLoaderRound />
      ) : (
        <Surface style={[styles.appoinmentContainer]}>
          <View
            style={{
              width: scale(82),
              height: verticalScale(14),
              backgroundColor: "transparent",
              borderBottomColor:statusColor[`${data?.Appointment_Status}Status` as keyof typeof statusColor]  || colorList.primary, // Adjust color
              borderBottomWidth: scale(15),
              borderRightWidth: scale(19),
              borderLeftWidth: scale(19),
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
              transform: [{ rotate: "-42deg" }],
              position: "absolute",
              left: scale(-21),
              top: scale(13),
            }}
          >
            <Text
              style={{
                position: "absolute",
                fontSize: moderateScale(8.2),
                fontWeight: "bold",
                color: colorList.white,
              }}
            >
              {data?.Appointment_Status}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleCancelAppoinments()}
            style={{
              // backgroundColor: colorList.red,
              position: "absolute",
              // padding: 2,
              // width:18,
              // height:18,
              top: 4,
              right: 4,
              justifyContent: "center",
              alignItems: "center",
              // borderRadius: 18,
              borderRadius: 7,
              borderWidth:1,
              borderColor:colorList.red,
              backgroundColor:colorList.red,
              paddingHorizontal:5,
            }}
          >
            <Text style={{color:colorList.white,fontSize:14}}>Cancel</Text>
            {/* <Icons name="delete" color={colorList.red} size={24} /> */}
          </TouchableOpacity>

          <View style={{ flex: 10, paddingHorizontal: 10,paddingTop:15 }}>
            <View style={styles.appoinmentNameSocial}>
              <TouchableOpacity
                style={[styles.appoinmentNameContainer]}
                onPress={navigate}
              >
                <Text style={styles.appoinmentNameLabel}>Patient Name</Text>
                <Text style={styles.appoinmentNameText}>
                  {data?.Patient_Name}
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.appoinmentNameSocialContainer,
                  Platform.OS == "ios" && { justifyContent: "space-around" },
                ]}
              >
               
                <TouchableOpacity onPress={openWhatsApp}>

                  <Icon name="whatsapp" color={colorList.socondary} size={25} />
                </TouchableOpacity>

                {Platform.OS !== "ios" && (
                  <TouchableOpacity style={{backgroundColor:colorList.primary,borderRadius:50,padding:3}} onPress={() => handlZoomLinkApi(data)}>
                    {/* <Image
                      source={ZoomMeetingIcon}
                      style={{ width: 25, height: 25, resizeMode: "contain" }}
                    /> */}
                    <Icon color={colorList.white} size={18} name="video"/>
                  </TouchableOpacity>
                )}
                 <TouchableOpacity onPress={openDialer}>
                  {/* <Image
                    source={CallFillIcon}
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                  /> */}
                  <Icon color={colorList.primary} size={22} name="phone"/>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.appoinmentDateTimeContainer}
              activeOpacity={0.9}
              onPress={navigate}
            >
              <View style={styles.appoinmentCalanderContainer}>
                <Icon name="calendar-month-outline" size={18} />
                <Text style={styles.appoinmentDate}>
                  {data?.Appointment_Date}
                </Text>
              </View>

              <View style={styles.appoinmentTimeContainer}>
                <Icon name="clock-time-five-outline" size={18} />
                <Text style={styles.appoinmentTime}>
                  {data?.Appointment_Time}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.appoinmentHrizontalLine} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 5,
                // backgroundColor:"green"
              }}
            >
              <TouchableOpacity
                onPress={navigate}
                style={[styles.appoinmentToContainer]}
              >
                {/* <Image
                  source={ProfileAvatar}
                  style={{
                    width: 28,
                    height: 28,
                    resizeMode: "contain",
                    borderRadius: 100,
                  }}
                /> */}
                <MetrialIcon name="person" size={25}/>
                <View style={styles.appoinmentToLabelTextContainer}>
                  <Text style={styles.appoinmentToLabel}>Appointment for</Text>
                  <Text style={styles.appoinmentToText}>
                    {data?.Doctor_Name}
                  </Text>
                </View>
              </TouchableOpacity>

              {data?.Appointment_Status != "Cancelled" &&
                data?.isFocused != "1" && (
                  <View
                    style={{ display: "flex", gap: 2, flexDirection: "row" }}
                  >
                    <TouchableOpacity
                      onPress={() => setQueueModal(true)}
                      style={[styles.appoinmentToContainer, {}]}
                    >
                      <View
                        style={{
                          width:80,
                          padding: 8,
                          borderRadius: 10,
                          borderWidth: 0.6,
                          borderColor: colorList.Grey3,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* <Text
                          style={[
                            styles.appoinmentToText,
                            {
                              fontSize: 10,
                              fontWeight: "400",
                              color: colorList.primary,
                            },
                          ]}
                        >
                          Queue Status
                        </Text> */}
                        <Text
                          style={{ color: statusColor[data?.queue_status  as keyof typeof statusColor], fontSize: 10 ,fontWeight:"bold"}}
                        >
                          {data?.queue_status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
            </View>

            {openQueueModal && (
              <CustomModal
                close={() => setQueueModal(false)}
                show={openQueueModal}
              >
                <View
                  style={{
                    display:"flex",
                    width: Dimensions.get("screen").width * 0.5,
                    justifyContent:"center",
                    alignItems:"center",
                  }}
                >
                  {queueStatusList?.map((list) => (
                    <TouchableOpacity
                      onPress={() => handleChangeQueueStatus(list?.name)}
                      style={{
                        padding: 5,
                        paddingVertical: 10,
                        borderWidth: 0.2,
                        borderRadius: 8,
                        marginVertical: 5,
                        borderColor: colorList.Grey3,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          textTransform: "capitalize",
                          color: colorList.Grey1,
                        }}
                      >
                        {list?.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <View
                    style={{
                      borderBottomWidth: 1,
                      marginVertical: 15,
                      borderColor: colorList.Grey3,
                    }}
                  />
                  {isLoading ? (
                    <CustomLoaderRound />
                  ) : (
                    <Button onPress={() => setQueueModal(false)}>Cancel</Button>
                  )}
                </View>
              </CustomModal>
            )}
          </View>

          {/* {data?.Appointment_Status != "Cancelled" && (
            <View
              style={{
                backgroundColor: colorList.socondary,
                position: "absolute",
                padding: 8,
                borderRadius: 8,
                bottom: -15,
                right: 10,
              }}
            >
              <Text style={{ color: colorList.white, fontSize: 10 }}>
                {data?.queue_status}
              </Text>
            </View>
          )} */}
          <Portal>
            <Modal
              visible={isCancelNote}
              onDismiss={() => setIsCancelNote(false)}
              style={{display:"flex",justifyContent:"center",alignItems:"center"}}
            >
              <View
                style={{
                  display:"flex",
                  backgroundColor: colorList.white,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                  width: Dimensions.get("screen").width * 0.8,
                  borderRadius: 8,
                  
                }}
              >
               <View style={{paddingVertical:5}}>
               <Text>Reason For Cancel</Text>
               </View>
                <View style={{ width: "80%" }}>
                  <TextInput
                    placeholder="Reason For Cancel"
                    mode="outlined"
                    onChangeText={(text) => setCancelNote(text)}
                  />
                  <Text style={{ color: colorList.red }}>* Required</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginVertical: 15,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Button
                        mode="elevated"
                        buttonColor={colorList.socondary}
                        textColor={colorList.white}
                        onPress={() => setIsCancelNote(false)}
                      >
                        Cancel
                      </Button>
                    </View>
                    <Button
                      mode="elevated"
                      buttonColor={colorList.red}
                      textColor={colorList.white}
                      style={{}}
                      onPress={() =>
                        cancelNote !== "" && handleCancelAppoinmentsApi()
                      }
                    >
                      Submit
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          </Portal>
        </Surface>
      )}
    </>
  );
};



const statusColor = {
   Scheduled:colorList.Grey1,
   Waiting:colorList.primary,
   Engaged:colorList.socondary,
   Checkout:colorList.warning,
   ScheduledStatus:colorList.primary,
   CancelledStatus:colorList.red,
   ConsultedStatus:colorList.socondary
}

