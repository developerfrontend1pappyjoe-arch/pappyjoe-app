import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import {getReceiptList } from "../services";
import { CustomLoader } from "components/CustomLoader";
import { NoDataAvailable } from "components/NoDataAvailable";
import { ReceiptContextType, ReceiptResultArrayType } from "./types";
import { colorList } from "styles/global.styles";
import ReceiptCard from "./components/ReceiptCard";
import { StoreTypes } from "redux/reducer";

export const ReceiptContext = createContext<ReceiptContextType>({
  refreshing: true,
  setRefreshing: () => {},
});

export const ReceiptProvider: FC<PropsWithChildren> = ({ children }) => {
  const [refreshing, setRefreshing] = useState<boolean>(true);
  return (
    <ReceiptContext.Provider value={{ refreshing, setRefreshing }}>
      {children}
    </ReceiptContext.Provider>
  );
};

const ReceiptContent: FC = () => {
  const {patientId,billing} = useSelector<any>((state) => state) as StoreTypes || null;
  const { refreshing, setRefreshing } = useContext(ReceiptContext);
  const { mutate, data, isLoading } = useMutation(getReceiptList, {
    onSuccess: () => {
      setRefreshing(false);
    },
  });
  const onRefresh = () => {
    setRefreshing(true)
  };
  const handleRefresh = () => {
    setRefreshing(true);
  };
  useEffect(() => {
    if(refreshing || !Boolean(billing?.billingModalOpen)){
      mutate(patientId as string);
    }
    return ()=>{
      if(!refreshing){
        setRefreshing(true)
      }
    }
  }, [refreshing,patientId,billing.billingModalOpen]);
  return (
    <View style={{ paddingBottom: 5 }}>
      <View style={{ paddingHorizontal: 8, paddingTop: 8 }}>
        {isLoading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <CustomLoader />
          </View>
        ) : (
          <FlatList
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 58 }}
            showsVerticalScrollIndicator={false}
            data={data?.list || []}
            renderItem={({ item }: { item: ReceiptResultArrayType }) => (
              <Card style={{ marginVertical: 5, padding: 5,backgroundColor:colorList.white }}>
                <ReceiptCard print={data?.print || null} data={item} />
              </Card>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            refreshing={refreshing || isLoading}
            onRefresh={handleRefresh}
          />
        )}
        {
          (!Boolean(data?.list?.length) && !isLoading) && <View style={{justifyContent:"center",alignItems:"center",height: 400}}><NoDataAvailable /></View>
        }
      </View>
    </View>
  );
};

const Receipt: FC = () => {
  const patientId = useSelector<any>(state=>state.patientId) || null
  
  return (
 <ReceiptProvider>
      <ReceiptContent />
 </ReceiptProvider>
  );
};

export default Receipt