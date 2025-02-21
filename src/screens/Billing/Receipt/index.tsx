import React, { FC, useContext } from "react";
import { FlatList, ScrollView } from "react-native";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";


const Receipt: FC = () => {
  const patientId = useSelector<any>(state=>state.patientId) || null
  
  return (
   <View style={{paddingBottom:5}}>
     <ScrollView style={{paddingHorizontal:8,paddingTop:8}}>
      
    </ScrollView>
   </View>
  );
};

export default Receipt