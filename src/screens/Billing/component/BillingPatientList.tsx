import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Avatar, Divider, List, TextInput, Text } from "react-native-paper";
import { colorList } from "styles/global.styles";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useMutation } from "@tanstack/react-query";
import { getPatientListService } from "screens/PatientListScreen/service/patientList.service";
import _, { set } from "lodash";
import { PatientListObjectType } from "../types";
import { CustomContentLoader } from "components/CustomContentLoader";
import { useNavigation } from "@react-navigation/native";
import { NavigationList } from "routes/NavigationList";
import { useDispatch } from "react-redux";
import { setPatientId } from "redux/actions";

const SearchInput = ({ searchParams, setSearchParams, clearSearch }: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 10,
      }}
    >
      {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 12,
          }}>
          <Image source={SearchIcon} />
        </View> */}
      <TextInput
        mode="outlined"
        placeholder="Search patients..."
        value={searchParams}
        onChangeText={(text) => setSearchParams(text)}
        placeholderTextColor={colorList.Grey4}
        left={
          <TextInput.Icon
            icon={() => (
              <Icons name="search" color={colorList.dark} size={25} />
            )}
          />
        }
        right={
          <TextInput.Icon
            onPress={clearSearch}
            icon={() => <Icons name="close" color={colorList.dark} size={25} />}
          />
        }
        style={{
          backgroundColor: colorList.white,
          color: colorList.Grey1,
          flex: 1,
        }}
      />
    </View>
  );
};
const limit = 10;
function BillingPatientList() {
  const [searchText, setSearchText] = useState<string>("");
  const [patiantList, setPatientList] = useState<PatientListObjectType[]>([]);
  const [page, setPage] = useState(0);
  const navigation = useNavigation();
  const { mutate, data, isLoading } = useMutation(getPatientListService, {
    onSuccess(result) {
      try {
        const { data } = result;
        if (data?.status == 200) {
          if (_.isEqual([[]], data.data)) {
            setPatientList([]);
          } else { 
            setPatientList((prev)=>searchText !== "" ? data?.data : [...prev, ...data.data]);
          }
        }
      } catch (err) {
        console.log("Error in fetching patient list", err);
      }
    },
  });
const dispatch = useDispatch();
 const navigate = (data: PatientListObjectType)=>{
    console.log(data.id);
    
    dispatch(setPatientId(data.id)); 
    navigation.navigate(NavigationList.billing);
 }

  const handleStart = () => {
    setPage((prev) => prev == 0 ? limit : prev + limit);
  };

  useEffect(() => {
    mutate({
      params: searchText,
      limit: `start=${page}&limit=${limit}`,
    });
  }, [searchText,page]);

  useEffect(()=>{
    return () => {
        setSearchText("");
        setPage(0);
      };
  },[])
  return (
    <View>
      <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 0 }}>
        <SearchInput
          searchParams={searchText}
          setSearchParams={setSearchText}
          clearSearch={() => setSearchText("")}
        />
      </View>
      <View style={{ height: 525 }}>
        <FlatList
          style={{ paddingHorizontal: 1, paddingBottom: 10 }}
          data={patiantList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }: { item: PatientListObjectType }) => (
            <>
              <TouchableOpacity onPress={()=>{navigate(item)}}>
                <List.Item
                  title={
                    <Text
                      style={{ fontSize: 14, fontWeight: "bold" }}
                    >{`${item.Name}`}</Text>
                  }
                  description={
                    <Text style={{ fontSize: 11 }}>Mobile : {item.mobile}</Text>
                  }
                  right={() => (
                    <Text style={{ fontSize: 12 }}>ID : {item.Patient_Id}</Text>
                  )}
                  left={(props) =>
                    item.Photo ? (
                      <Avatar.Image
                        style={{ marginLeft: 5,borderWidth:.5,borderColor:colorList.Grey1 }}
                        size={40}
                        source={{ uri: item.Photo }}
                      />
                    ) : (
                      <Avatar.Text
                        style={{ marginLeft: 3 }}
                        size={40}
                        label={item.Name[0]}
                      />
                    )
                  }
                />
              </TouchableOpacity>
            </>
          )}
          onEndReached={handleStart}
          ListFooterComponent={() =>
            isLoading ? <CustomContentLoader listSize={8} /> : null
          }
        />
      </View>
    </View>
  );
}

export default BillingPatientList;
