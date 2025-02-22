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
import { InvoiceContextType, InvoiceItemType, ResultArrayType } from "./types";
import { useMutation } from "@tanstack/react-query";
import { getInvoiceList } from "../services";
import InvoiceCard from "../component/InvoiceCard";
import { CustomLoader } from "components/CustomLoader";
import { NoDataAvailable } from "components/NoDataAvailable";
const invoiceItem = {
  date_time: "2024-05-12",
  Item_name: "ITEM REF",
  item_id: "276531",
  cost: "700",
  quantity: "1",
  discount: "0",
  discount_type: "%",
  tax: "5.13",
  batch: "",
  itemtotal: "700",
  invoicetotal: "807.63",
  invoicebalance: "807.63",
  status: "Active",
  stockqty: "35",
};
export const InvoiceContext = createContext<InvoiceContextType>({
  refreshing: true,
  setRefreshing: () => {},
});
export const InvoiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [refreshing, setRefreshing] = useState<boolean>(true);
  return (
    <InvoiceContext.Provider value={{ refreshing, setRefreshing }}>
      {children}
    </InvoiceContext.Provider>
  );
};

const InvoiceContent: FC = () => {
  const patientId = useSelector<any>((state) => state.patientId) || null;
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
  useEffect(() => {
    if(refreshing){
      mutate(patientId as string);
    }
    return ()=>{
      if(!refreshing){
        setRefreshing(true)
      }
    }
  }, [refreshing,patientId]);
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
            showsVerticalScrollIndicator={false}
            data={data || []}
            renderItem={({ item }: { item: ResultArrayType }) => (
              <View>
                <InvoiceCard data={item} />
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
          (!Boolean(data?.length) && !isLoading) && <View style={{justifyContent:"center",alignItems:"center",height: 400}}><NoDataAvailable /></View>
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
