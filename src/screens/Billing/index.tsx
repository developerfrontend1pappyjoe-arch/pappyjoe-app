import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import Invoice from "./Invoice";
import Receipt from "./Receipt";
import { colorList } from "styles/global.styles";
import { PatientDetailsTiles } from "components/PatientDetailsTiles";
import { Divider, FAB } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "hooks";
import { useQuery } from "@tanstack/react-query/build/lib/useQuery";
import { getFinaceMaster } from "./services";
import { useToast } from "react-native-toast-notifications";
import { closeBillingModal, openBillingModal } from "redux/actions";
import { CustomLoaderRound } from "components/CustomLoaderRound";
const AddInvoice = lazy(() => import("./Invoice/components/AddInvoice"));
const AddReceipt = lazy(() => import("./Receipt/components/AddReceipt"));
const renderScene = SceneMap({
  Invoice: Invoice,
  Receipt: Receipt,
});
// const patientId = "4060513"
function Billing({ navigation, route }: any) {
  const dimention = useWindowDimensions();
  const { CustomModal } = useModal();
  // const [open,setOpen] = useState<boolean>(false)
  const { patientDetails, billing } = useSelector((state: any) => state) || {
    patientDetails: null,
    billing: null,
  };
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const toast = useToast();
  const dispatch = useDispatch();
  useQuery(["financeMaster"], getFinaceMaster, {
    onError: (e: any) => {
      toast.show(e.message || "Something error!", {
        type: "warning",
      });
    },
  });
  const [routes] = useState([
    { key: "Invoice", title: "Invoice" },
    { key: "Receipt", title: "Receipt" },
  ]);

  const openMoadl = () => {
    dispatch(openBillingModal());
  };

  const closeModal = () => {
    dispatch(closeBillingModal());
  };

  //  const {data:patientDetails,isLoading} = useQuery(["getPatientDetails",patientId],()=>getPatientDetailsService({id:patientId}),{
  //   enabled: !!patientId,
  //  })

useEffect(()=>{
 console.log("billing?.billingModalOpen---->",billing?.billingModalOpen)
},[billing?.billingModalOpen])

  return (
    <View style={styles.container}>
      <CustomModal
        title={index == 0 ? "Add invoice" : "Add receipt"}
        open={Boolean(billing?.billingModalOpen||null)}
        handleCloseModal={closeModal}
      >
        <View style={{ height: Dimensions.get("screen").height - 172 }}>
          {index == 0 ? (
            <Suspense
              fallback={
                <View
                  style={{
                    height: Dimensions.get("screen").height - 172,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CustomLoaderRound />
                </View>
              }
            >
              <AddInvoice />
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <View
                  style={{
                    height: Dimensions.get("screen").height - 172,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CustomLoaderRound />
                </View>
              }
            >
              <AddReceipt />
            </Suspense>
          )}
        </View>
      </CustomModal>
      {Boolean(patientDetails) && <PatientDetailsTiles />}
      <Divider />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true} // Enables swiping
        style={styles.tabView}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar} // Background color
            indicatorStyle={styles.indicator} // Active tab indicator
            activeColor={colorList.primary} // Active tab text color
            inactiveColor={colorList.Grey1} // Inactive tab text color
            labelStyle={styles.label} // Tab text styling
          />
        )}
      />
      <FAB
        icon="plus"
        color={colorList.white}
        style={styles.fab}
        onPress={openMoadl}
      />
    </View>
  );
}

export default Billing;

const styles = StyleSheet.create({
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
    backgroundColor: colorList.white, // Background color of the tab bar
    height: 50, // Height of the tab bar
  },
  indicator: {
    backgroundColor: colorList.primary, // Active tab indicator color
    height: 4, // Thickness of the active tab indicator
  },
  label: {
    fontSize: 14, // Font size for the tab labels
    fontWeight: "bold", // Bold text
  },
});
