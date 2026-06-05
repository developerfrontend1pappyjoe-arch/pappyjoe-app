import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { styles } from "./appoinmentDetails.styles";
import { CustomHeader } from "../../components/CustomHeader";
import { ArrowLeftIcon } from "../../assets";

import { CustomLoaderRound } from "../../components/CustomLoaderRound";
import { MenuListDetailsChiefComplaints } from "./components/clinicalNotes/MenuListClinicalNotes";
import { MenuListDetailsFileList } from "./components/files/MenuListFileLists";

import { PatientDetailsTiles } from "../../components/PatientDetailsTiles";
import { MenuListDetailsProcedure } from "./components/procedure/MenuLIstProcedure";
import { MenuListDetailsVitalSigns } from "./components/vitals/MenuLIstVitalSigns";
import { NavigationList } from "../../routes/NavigationList";
import { MenuListPrescription } from "./components/prescription/MenuListPrescription";
import { useDispatch, useSelector } from "react-redux";
import { assignPatientDetails, setPatientId } from "redux/actions";
import { TabView, TabBar } from "react-native-tab-view";
import { colorList } from "styles/global.styles";
import {
  APPOINTMENT_ACCESS_DENIED_MESSAGE,
  canManageAppointment,
} from "utils/appointmentUtils";

const MenuList = [
  { id: 1, name: "Vital Signs" },
  { id: 2, name: "Clinical notes" }, //'Chief Complaints'
  { id: 3, name: "Procedure" }, //'Treatments'
  { id: 4, name: "Prescription" },
  { id: 5, name: "Add X-Rays/Photos/Files" },
];

const HorizontalMenus = ({ id, name, focused, isFocused }: any) => {
  const focusedItem = isFocused === id;
  return (
    <TouchableOpacity
      onPress={focused}
      style={[
        styles.HorizontalMenusContainer,
        { borderWidth: isFocused === id ? 1 : 0 },
      ]}
    >
      <Text
        style={
          focusedItem
            ? styles.HorizontalMenusFocusedText
            : styles.HorizontalMenusNormalText
        }
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export const AppoinmentDetails = ({ navigation, route }: any) => {
  const {
    patientId,
    patientData: patientDetails,
    appointmentDetails = null,
    from = "",
  } = route.params;
  
  const layout = useWindowDimensions();
  const [isFocused, setIsFocused] = useState(1);
  const dispatch = useDispatch();
  const loginData = useSelector((state: any) => state.loginData);
  const canManage = canManageAppointment(appointmentDetails, loginData);
  const showEditAction = appointmentDetails
    ? canManage
    : loginData?.roles?.patient === "1" || loginData?.roles?.admin === "1";

  useEffect(() => {
    if (!appointmentDetails || canManage) {
      return;
    }

    Alert.alert("Access denied", APPOINTMENT_ACCESS_DENIED_MESSAGE, [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }, [appointmentDetails, canManage, navigation]);

  let isLoading = false;
  const [index, setIndex] = useState<number>(0);
  const [listFetchKey, setListFetchKey] = useState(0);
  const [routes] = useState([
    { key: "Vitals", title: "Vital Signs" },
    { key: "ChiefComplaints", title: "Clinical notes" },
    { key: "Procedure", title: "Procedure" },
    { key: "Prescription", title: "Prescription" },
    { key: "Files", title: "Add X-Rays/Photos/Files" },
  ]);

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case "Vitals":
          return <MenuListDetailsVitalSigns listFetchKey={listFetchKey} />;
        case "ChiefComplaints":
          return <MenuListDetailsChiefComplaints listFetchKey={listFetchKey} />;
        case "Procedure":
          return <MenuListDetailsProcedure listFetchKey={listFetchKey} />;
        case "Prescription":
          return <MenuListPrescription listFetchKey={listFetchKey} />;
        case "Files":
          return <MenuListDetailsFileList listFetchKey={listFetchKey} />;
        default:
          return null;
      }
    },
    [listFetchKey]
  );

  useEffect(() => {
    if (Boolean(patientDetails)) {
      dispatch(setPatientId(patientDetails?.id || ""));
      dispatch(assignPatientDetails(patientDetails));
      setListFetchKey((key) => key + 1);
    }
    return () => {
      dispatch(assignPatientDetails(null));
    };
  }, [patientDetails]);

  if (isLoading) {
    return <CustomLoaderRound center />;
  }

  if (appointmentDetails && !canManage) {
    return <CustomLoaderRound center />;
  }

  return (
      <View style={{ flex: 1 }}>
        <View style={{backgroundColor:"red" }}>
          <CustomHeader
            headerText={
              from === "patient-list"
                ? "Patient Details"
                : "Appointment Details"
            }
            leftIcon={ArrowLeftIcon}
            leftIconAction={() => navigation.goBack()}
            rightText={showEditAction ? "Edit" : undefined}
            rightTextAction={
              showEditAction
                ? () =>
                    appointmentDetails
                      ? navigation.navigate(NavigationList.bookingAppoinment, {
                          data: { data: appointmentDetails, mode: "edit" },
                        })
                      : navigation.navigate(NavigationList.patientEdit, {
                          patientDetails,
                          mode: "edit",
                        })
                : undefined
            }
          />
        </View>

        <View style={[styles.container]}>
          <PatientDetailsTiles isLoading={isLoading} patientId={patientId} />
        </View>
        <View style={[styles.container, { flex: 1 }]}>
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "nowrap",
              marginVertical: 10,
            }}
          >
            {MenuList?.map((item) => {
              return (
                <HorizontalMenus
                  key={item?.id}
                  {...item}
                  isFocused={isFocused}
                  focused={() => setIsFocused(item.id)}
                />
              );
            })}
          </ScrollView> */}
                {patientDetails && <TabView
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  initialLayout={{ width: layout.width }}
                  lazy
                  lazyPreloadDistance={0}
                  swipeEnabled={true}
                  style={style.tabView}
                  renderTabBar={(props) => (
                    <TabBar
                      {...props}
                      style={style.tabBar} // Background color
                      indicatorStyle={style.indicator} // Active tab indicator
                      activeColor={colorList.primary} // Active tab text color
                      scrollEnabled={true}
                      inactiveColor={colorList.Grey1} // Inactive tab text color
                      labelStyle={style.label} // Tab text styling
                    />
                  )}
                />}
        </View>
        {/* {Boolean(patientDetails) && (
          <View style={{ flex: 7.5, paddingHorizontal: 16 }}>
            {patientDetails && isFocused === 1 ? (
              <MenuListDetailsVitalSigns />
            ) : isFocused === 2 ? (
              <MenuListDetailsChiefComplaints />
            ) : isFocused === 3 ? (
              <MenuListDetailsProcedure />
            ) : isFocused === 4 ? (
              <MenuListPrescription/>
            ) : isFocused === 5 ? (
              <MenuListDetailsFileList/>
            ) : null}
          </View>
        )} */}
      </View>
    );
};

const style = StyleSheet.create({
  fab: {
    position: "absolute",
    marginHorizontal: 16,
    marginBottom: 10,
    right: 0,
    bottom: 0,
    backgroundColor: colorList.socondary,
  },
  container: {
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: colorList.white,
    height: 50,
  },
  indicator: {
    backgroundColor: colorList.primary,
    height: 4, 
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
  },
});