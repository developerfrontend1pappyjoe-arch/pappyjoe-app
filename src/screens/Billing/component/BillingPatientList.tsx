import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

import { colorList } from "styles/global.styles";
import BillingPatientSearch from "./BillingPatientSearch";
import QrPaymentList from "./QrPaymentList";

const renderScene = SceneMap({
  patients: BillingPatientSearch,
  qrPayments: QrPaymentList,
});

function BillingPatientList() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "patients", title: "Patients" },
    { key: "qrPayments", title: "QR Payments" },
  ]);

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        style={styles.tabView}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicator}
            activeColor={colorList.primary}
            inactiveColor={colorList.Grey1}
            labelStyle={styles.label}
          />
        )}
      />
    </View>
  );
}

export default BillingPatientList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorList.white,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: colorList.white,
    height: 48,
  },
  indicator: {
    backgroundColor: colorList.primary,
    height: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "none",
  },
});
