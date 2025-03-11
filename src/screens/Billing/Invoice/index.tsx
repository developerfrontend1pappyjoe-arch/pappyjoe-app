import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
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
import { InvoiceContextType, InvoiceItemType, InvoiceSaveObjectType, ResultArrayType } from "./types";
import { useMutation } from "@tanstack/react-query";
import { getInvoiceList } from "../services";
import InvoiceCard from "./components/InvoiceCard";
import { CustomLoader } from "components/CustomLoader";
import { NoDataAvailable } from "components/NoDataAvailable";
import { PatientDataProps } from "types/PatientDetailsTypes";
import { StoreTypes } from "redux/reducer";
export const InvoiceContext = createContext<InvoiceContextType>({
  refreshing: true,
  setRefreshing: () => {},
});
export const InvoiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [refreshing, setRefreshing] = useState<boolean>(true);
  return (
    <InvoiceContext.Provider value={{ refreshing, setRefreshing}}>
      {children}
    </InvoiceContext.Provider>
  );
};

const InvoiceContent: FC = () => {
  const {patientDetails,billing} = useSelector<any>((state) => state) as StoreTypes
  const { refreshing, setRefreshing } = useContext(InvoiceContext);
  const { mutate, data, isLoading } = useMutation(getInvoiceList, {
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

const displayList = useMemo(()=> data?.invoiceList ? data?.invoiceList : [],[data?.invoiceList])

  useEffect(() => {
    if(refreshing){
      if(Boolean(patientDetails?.id) || !Boolean(billing?.billingModalOpen)){
        mutate({id:patientDetails?.id as string});
      }
    }
    return ()=>{
      if(!refreshing){
        setRefreshing(true)
      }
    }
  }, [refreshing,patientDetails,billing.billingModalOpen]);
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
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
            data={displayList || []}
            renderItem={({ item }: { item: ResultArrayType }) => (
              <View>
                <InvoiceCard print={data?.print || null} data={item} />
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            refreshing={refreshing || isLoading}
            onRefresh={handleRefresh}
          />
        )}
        {
          (!Boolean(data?.invoiceList?.length) && !isLoading) && <View style={{justifyContent:"center",alignItems:"center",height: 400}}><NoDataAvailable /></View>
        }
      </View>
    </View>
  );
};

const Invoice: FC<PropsWithChildren> = ({}) => {
  return (
    <InvoiceProvider>
      <InvoiceContent />
    </InvoiceProvider>
  );
};

export default Invoice;
