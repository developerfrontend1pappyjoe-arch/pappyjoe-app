import React, { Suspense, useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import Invoice from "./Invoice";
import Receipt from "./Receipt";
import { colorList } from "styles/global.styles";
import { PatientDetailsTiles } from "components/PatientDetailsTiles";
import { Divider } from "react-native-paper";
import {
  // useDispatch,
  useSelector,
} from "react-redux";

const InvoiceLazyComponent = ()=>{
  <Suspense fallback={<Text>Loading.....</Text>}>
    <Invoice />
  </Suspense>
}

const renderScene = SceneMap({
  Invoice: Invoice,
  Receipt: Receipt,
});
// const patientId = "4060513"
function Billing() {
  // const dispatch = useDispatch()
  const patientId = useSelector((state: any) => state?.patientId) || "";
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "Invoice", title: "Invoice" },
    { key: "Receipt", title: "Receipt" },
  ]);


  return (
    <View style={styles.container}>
      {patientId && <PatientDetailsTiles patientId={patientId} />}
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
    </View>
  );
}

export default Billing;

const styles = StyleSheet.create({
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
