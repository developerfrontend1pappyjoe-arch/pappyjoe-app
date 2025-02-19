import React from "react";
import { Text, View } from "react-native";
import Invoice from "./Invoice";
import Receipt from "./Receipt";
import { CustomHeader } from "components/CustomHeader";

function Billing() {
  return (
    <View>
    <Text>  Billing</Text>
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
