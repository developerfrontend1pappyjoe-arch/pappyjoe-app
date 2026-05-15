import React, { useState, useCallback, useEffect, memo } from "react";
import { View, RefreshControl, BackHandler } from "react-native";
import moment from "moment";
import { HomeHeader } from "./components/Header";
import { FilterSection } from "./components/FilterSection";
import { FlatList } from "react-native";
import { CounterContainer } from "./components/CounterContainer";
import { AppoinmentList } from "./components/AppoinmentList";
import { NavigationList } from "../../routes/NavigationList";
import { useDispatch, useSelector } from "react-redux";
import { NoDataAvailable } from "../../components/NoDataAvailable";
import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { handleHomeAppoinmentFilter } from "../../redux/actions";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { getAppoinments } from "./services/getAppoinmentsList";
import { getPatientListService } from "screens/PatientListScreen/service/patientList.service";
import { useToast } from "react-native-toast-notifications";
import { useModal } from "hooks";
import { ActivityIndicator, Text } from "react-native-paper";
import _ from "lodash";
import LottieView from "lottie-react-native";
import { CustomLoader } from "components/CustomLoader";
export const HomeScreen = memo(({ navigation }: any) => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState("0");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isFilterOn, setIsFilterOn] = useState(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [appointmentDetails, setAppointmentDetails] = useState<any>();
  const homeAppoinmentFilter =
    useSelector<any>((state) => state.homeAppoinmentFilter) || {};
  const { CustomModal } = useModal();
  const toast = useToast();
  const handleFilterIsOn = () => {
    let count = 0;
    Object.values(homeAppoinmentFilter)?.forEach((el) => {
      if (el !== "") count += 1;
    });
    if (count > 2) {
      setIsFilterOn(true);
    } else setIsFilterOn(false);
  };

  const {
    mutate,
    data: appoinmentList,
    isLoading,
  } = useMutation(getAppoinments, {
    onSuccess: (result) => {
      if (result.data) {
        handleFilterIsOn();
      }
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { mutate: getPatientById, isLoading: patientDetailsLoading } =
    useMutation(getPatientListService, {
      onSuccess: (result) => {
        if (
          result.status >= 200 ||
          (result.status < 300 && !_.isEqual([[]], result?.data))
        ) {
          const patientData = result.data[0];
          console.log(result);
          navigation.navigate(NavigationList.appoinmentDetails, {
            patientId: patientData?.id,
            patientData,
            appointmentDetails,
          });
        }
      },
      onError: () => {
        toast.show("Failed to fetch patient details !", {
          type: "error",
        });
      },
    });

  const fetchAppointments = () => {
    const params = { ...homeAppoinmentFilter, limit: 300 };
    mutate(params);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
      return () => {
        console.log("Screen unfocused");
      };
    }, [])
  );

  const handleSetFilterParamsToday = () => {
    const temp = { ...homeAppoinmentFilter } as any;
    temp.from_date = moment().format("DD-MM-YYYY");
    temp.to_date = moment().format("DD-MM-YYYY");
    dispatch(handleHomeAppoinmentFilter(temp));
  };

  const handleSetFilterParamsUpcomming = () => {
    const temp = { ...homeAppoinmentFilter } as any;
    temp.from_date = moment().add(1, "day").format("DD-MM-YYYY");
    temp.to_date = "";
    dispatch(handleHomeAppoinmentFilter(temp));
  };

  const handleFetchPatientDetails = (paientDetails: any) => {
    console.log(paientDetails.Patient_Id);
    getPatientById({
      pid: paientDetails.Patient_Id,
      limit: 0,
      search: "",
      start: 0,
    });
  };

  useEffect(() => {
    fetchAppointments();
    return () => {
      setRefetch(false);
    };
  }, [isFocused, refetch]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <CustomModal
        title={<Text variant="bodyLarge">Fetch patient details</Text>}
        // open={true}
        open={patientDetailsLoading}
      >
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <CustomLoader />
        </View>
      </CustomModal>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: 15,
        }}
      >
        <HomeHeader refetch={() => setRefetch(true)} />

        <FilterSection
          refetch={() => setRefetch(true)}
          isFocused={isFocused}
          showFilterPopup={showFilterPopup}
          setShowFilterPopup={setShowFilterPopup}
          resetToday={handleSetFilterParamsToday}
          resetUpcomming={handleSetFilterParamsUpcomming}
          isFilter={isFilterOn}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <CounterContainer
            isFocused={isFocused}
            value="0"
            setIsFocused={() => {
              setIsFocused("0");
              handleSetFilterParamsToday();
            }}
            text="Today's"
            count={appoinmentList?.count}
            loading={isLoading}
          />
          <CounterContainer
            value="1"
            isFocused={isFocused}
            setIsFocused={() => {
              setIsFocused("1");
              handleSetFilterParamsUpcomming();
            }}
            text="Upcoming"
            count={appoinmentList?.count}
            loading={isLoading}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 5 }}>
          {isLoading ? (
            <CustomLoaderRound />
          ) : appoinmentList?.data ? (
            <FlatList
              data={appoinmentList?.data}
              contentContainerStyle={{ paddingBottom: 23 }}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: any) => (
                <AppoinmentList
                  data={{ ...item, ...{ isFocused: isFocused } }}
                  {...navigation}
                  navigate={() => {
                    setAppointmentDetails(item);
                    handleFetchPatientDetails(item);
                    // navigation.navigate(NavigationList.appoinmentDetails, {
                    //   patientId: item?.Patient_Id,
                    //   appointmentDetails: item,
                    // })
                  }}
                  refetch={() => setRefetch(true)}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refetch}
                  onRefresh={() => setRefetch(true)}
                />
              }
              onEndReached={() => setPage(page + 1)}
            />
          ) : (
            <View
              style={{
                minHeight: 400,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NoDataAvailable />
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

HomeScreen.displayName = "HomeScreen";

const data = {
  appointmentDetails: {
    Appointment_Date: "11-03-2025",
    Appointment_Id: "3246005",
    Appointment_Notes: "0",
    Appointment_Status: "Scheduled",
    Appointment_Time: "8:54 pm",
    Doctor_Name: "Dr niikhil ",
    Doctor_id: "498611",
    Patient_Id: "5596833",
    Patient_Mobile: "7594021050",
    Patient_Name: "Abel",
    Patient_Photo: "https://cloud.pappyjoe.com/newversion/dist/img/a5.png",
    Patient_code: "HARV295",
    Patient_country_code: "91",
    Patient_email: "abel@gmail.com",
    Patient_mobile: "7594021050",
    Patient_phone: "",
    queue_status: "Scheduled",
  },
  patientData: [],
  patientId: undefined,
};
