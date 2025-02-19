import React from "react";
import { View } from "react-native";
import Invoice from "./Invoice";
import Receipt from "./Receipt";

function Billing() {
  return (
    <View>
      Billing
      <View>
        <Invoice />
      </View>
      <View>
        <Receipt />
      </View>
    </View>
  );
}

export default Billing;
