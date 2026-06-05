// import axios from 'axios';
import React from "react";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../../../utils/constants";
import loadsh from "lodash";
import { CustomLoaderRound } from "../../../../components/CustomLoaderRound";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { CustomAddButton } from "../../../../components/CustomAddButton";
import { NoDataAvailable } from "../../../../components/NoDataAvailable";
import { CustomModal } from "../../../../components/CustomModal";
import { styles } from "../../appoinmentDetails.styles";
import { colorList } from "../../../../styles/global.styles";
import moment from "moment";
import { AddEditVitalsForm } from "./AddEditVitalsForm";
import { Divider, Surface, Text, Button, FAB } from "react-native-paper";
import { ShareModal } from "../ShareModal";
import { ListViews } from "./components/ListViews";
import { axiosInstance } from "../../../../config/axios.config.custom";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { StoreTypes } from "redux/reducer";
export const MenuListDetailsVitalSigns = ({
  listFetchKey = 0,
}: {
  listFetchKey?: number;
}) => {
  const axios = axiosInstance;
  const [isPopup, setIspoup] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [vitalsList, setVitalsList] = useState([]);
  const [vitalsEditdata, setVitalsEditdata] = useState(null);
  const [openedShareListId, setOpenedShareListId] = useState(null);
  const handleOpenShareModal = (listId) => setOpenedShareListId(listId);
  const handleCloseShareModal = () => setOpenedShareListId(null);
  const patientDetails = useSelector(
    (state: StoreTypes) => state.patientDetails
  );

  const getVitalsListApi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL.vitalsList}?patient_id=${patientDetails?.id}`
      );
      let result = [];
      setLoading(false);
      if (loadsh.isEqual(res?.data?.data, [[]])) {
        result = [];
      } else {
        result = res?.data?.data;
      }

      const groupedData = {};
      if (result?.length) {
        const sortedDates = res?.data?.data
          .map((obj) => obj.added_date)
          .sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach((date) => {
          // console.log('Processing date:', date);
          res?.data?.data.forEach((obj) => {
            // console.log(
            //   'Checking object with added_date and ID:',
            //   obj.added_date,
            //   obj.id,
            // );
            if (obj.added_date === date) {
              if (!groupedData[date]) {
                groupedData[date] = [];
              }
              const isIdPresent = groupedData[date].some(
                (existingObj) => existingObj.id === obj.id
              );
              if (!isIdPresent) groupedData[date].push(obj);
            }
          });
        });
      }
      setVitalsList(groupedData);
    } catch (error) {
      setLoading(false);
      console.error("Err in getTreatments Details....", error);
      setVitalsList([]);
    }
  };

  const order = ["temperature", "weight", "height"];
  const order2 = [
    "sugar",
    "pulse",
    "cholesterol",
    "spo",
    "respiratory",
    // 'added_date',
    // 'covtest',
    // 'covstartdate',
    // 'covenddate',
    // 'remarks',
    // 'vaccinestatus',
    // 'vaccinecompany',
    // 'firstdose',
    // 'seconddose',
    // 'vaccinecompany1',
    // 'vaccinecompany2',
    // 'booster1',
    // 'booster2',
    // 'uniqueid',
  ];

  const handleDeleteVitalApi = async (id: any) => {
    try {
      setLoading(true);
      const formDetails = new FormData();
      formDetails.append("uniqueid", id);

      axios
        .delete(API_URL.vitals, {
          data: formDetails,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            Alert.alert("Success", res?.data?.message || "Added Successfully", [
              { text: "Ok", onPress: () => setRefetch(true) },
            ]);
          } else {
            setLoading(false);
            Alert.alert(
              res.data?.message || "Somthing went wrong,please try agin later"
            );
          }
        })
        .catch((err) => {
          // console.log('Errrrrr in delete vitals', err?.response?.data?.message);
          Alert.alert(
            "Error",
            err?.response?.data?.message || "Error, Please try again later"
          );
        });
    } catch (err) {
      // console.log('Errrrrr in delete vitals', err?.response?.data?.message);
    }
  };

  const handleDeleteVitals = (id: any) => {
    Alert.alert("Warning", "Are you sure, you want to delete this vital ?", [
      { text: "Cancel", onPress: () => {} },
      { text: "Confirm", onPress: () => handleDeleteVitalApi(id?.unique) },
    ]);
  };

  const onRefresh = useCallback(() => {
    setRefetch(true);
  }, []);

  useEffect(() => {
    if (!listFetchKey || !patientDetails?.id) {
      return;
    }
    setRefetch(true);
  }, [listFetchKey, patientDetails?.id]);

  useEffect(() => {
    if (!refetch || !patientDetails?.id) {
      return;
    }
    getVitalsListApi();
    setTimeout(() => {
      setRefetch(false);
    }, 100);
  }, [refetch, patientDetails?.id]);

  if (isLoading) {
    return <CustomLoaderRound />;
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colorList.white,
          borderRadius: 10,
        }}
      >
        <ScrollView
          style={{ maxHeight: Dimensions.get("screen").height - 10}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        >
          {Object.keys(vitalsList)?.length ? (
            Object.entries(vitalsList)?.map(([k, v], ids) => {
              // console.log('ids ====>', ids);

              const capitalizeFirstLetter = (string: any) =>
                string.charAt(0).toUpperCase() + string.slice(1) + " ";

              return (
                <View
                  key={v?.id}
                  style={{
                    marginBottom: 38,
                    borderRadius: 8,
                    backgroundColor: "#fff",
                  }}
                >
                  <View
                    style={{
                      margin: 10,
                      borderBottomWidth: 0.2,
                      paddingBottom: 8,
                      borderColor: colorList?.Grey3,
                    }}
                  >
                    <Text
                      variant="labelLarge"
                      style={{ color: colorList.dark }}
                    >
                      {moment(k).format("DD-MM-YYYY")}
                    </Text>
                  </View>

                  {v?.map((list: any, ids2: number) => {
                    return (
                      <Surface
                        key={ids2}
                        style={{
                          backgroundColor: colorList.white,
                          margin: 12,
                          borderRadius: 8,
                          paddingVertical: 10,
                        }}
                        elevation={1}
                      >
                        {order.map((key: any, index: number) => {
                          const val = list[key];
                          if (val != null && val !== "" && val != 0) {
                            return (
                              <View
                                key={index}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  borderRadius: 12,
                                  paddingHorizontal: 10,
                                  paddingVertical: 8,
                                  borderBottomWidth: 1,
                                  borderColor: colorList.Grey6,
                                }}
                              >
                                <View style={{ flex: 1 }}>
                                  <Text
                                    variant="labelMedium"
                                    style={{ color: colorList.dark }}
                                  >
                                    {key
                                      ?.split("_")
                                      .map((part: any) =>
                                        capitalizeFirstLetter(part)
                                      )}
                                  </Text>
                                </View>

                                <Text
                                  variant="labelMedium"
                                  style={{ color: colorList.dark }}
                                >
                                  {key === "temperature"
                                    ? val + " (°F)"
                                    : key === "weight"
                                      ? val + " (kg)"
                                      : key === "height"
                                        ? val + " (m)"
                                        : key === "systolic"
                                          ? val + " (mmHg)"
                                          : key === "diastolic"
                                            ? val + " (mmHg)"
                                            : val}
                                </Text>
                                <Divider />
                              </View>
                            );
                          }
                        })}
                        {parseInt(list["systolic"]) !== 0 &&
                          parseInt(list["diastolic"]) !== 0 && (
                            <>
                              <View
                                style={{
                                  flexDirection: "row",
                                  // justifyContent: 'space-between',
                                  paddingHorizontal: 10,
                                  paddingVertical: 8,
                                }}
                              >
                                <Text
                                  variant="labelMedium"
                                  style={{ color: colorList.dark }}
                                >
                                  Blood Pressure :- {list["systolic"]} /{" "}
                                  {list["diastolic"]}{" "}
                                  {`( ${list["bp_type"]} ) mmHg`}
                                </Text>
                              </View>
                              <Divider style={{ marginVertical: 5 }} />
                            </>
                          )}
                        {order2.map((key: any, index: number) => {
                          const val = list[key];

                          if (
                            val != null &&
                            val !== "" &&
                            val != 0 &&
                            val != "0000-00-00" &&
                            val != "undefined"
                          ) {
                            return <ListViews keys={key} val={val} />;
                          }
                        })}

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            margin: 10,
                          }}
                        >
                          <Button
                            mode="text"
                            onPress={() => {
                              setIspoup(true);
                              setVitalsEditdata(list);
                            }}
                            style={
                              {
                                // backgroundColor: colorList.primary,
                              }
                            }
                            labelStyle={{
                              color: colorList.primary,
                            }}
                          >
                            <Icons
                              name="edit"
                              size={20}
                              color={colorList.primary}
                            />
                          </Button>

                          <Button
                            mode="text"
                            onPress={() => handleDeleteVitals(list)}
                            style={
                              {
                                // backgroundColor: colorList.red,
                              }
                            }
                            labelStyle={{
                              // color: colorList.white,
                              color: colorList.red,
                            }}
                          >
                            <Icons
                              name="delete"
                              size={23}
                              color={colorList.red}
                            />
                          </Button>

                          <ShareModal
                            open={openedShareListId === `${ids}${ids2}`}
                            openMenu={() =>
                              handleOpenShareModal(`${ids}${ids2}`)
                            }
                            closeMenu={handleCloseShareModal}
                            data={{ ...list, ...patientDetails }}
                            whatsapp
                            email
                            prints
                            mailTitle="Vitals Details"
                            mailContent={"Vitals Details"}
                          />
                        </View>
                      </Surface>
                    );
                  })}
                </View>
              );
            })
          ) : (
            <NoDataAvailable />
          )}
        </ScrollView>

        {/* <View style={{height: 70, position: 'absolute', bottom: 5, right: 5}}>
          <View style={styles.MenuListDetailsChiefComplaintsAddBtnContainer}>
            <CustomAddButton
              onClick={() => {
                setIspoup(true);
                setVitalsEditdata(null);
              }}
            />
          </View>
        </View> */}

        <FAB
          mode="flat"
          style={style.fab}
          color={colorList.white}
          icon="plus"
          onPress={() => {
            setIspoup(true);
            setVitalsEditdata(null);
          }}
        />

        <CustomModal
          show={isPopup}
          close={() => setIspoup(false)}
          title={vitalsEditdata ? "Vital Signs Edit" : "Vital Signs Add"}
        >
          <AddEditVitalsForm
            close={() => setIspoup(false)}
            patientDetails={patientDetails}
            refetch={() => setRefetch(true)}
            editData={vitalsEditdata}
          />
        </CustomModal>
      </View>
    );
  }
};

const style = StyleSheet.create({
  fab:{
    position: "absolute",
    marginHorizontal: 16,
    marginBottom: 10,
    right: 0,
    bottom: 0,
    backgroundColor: colorList.socondary,
  }
})