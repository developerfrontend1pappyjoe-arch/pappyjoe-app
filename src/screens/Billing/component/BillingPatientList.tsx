import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Divider,
  List,
  TextInput,
  Text,
  ActivityIndicator,
} from "react-native-paper";
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
import { assignPatientDetails, setPatientId } from "redux/actions";
const limit = 10;
function BillingPatientList() {
  const [searchText, setSearchText] = useState<string>("");
  const [patiantList, setPatientList] = useState<PatientListObjectType[]>([]);
  const [page, setPage] = useState(0);
  const navigation = useNavigation();
  const {
    mutate,
    data: patientListResponse,
    isLoading,
  } = useMutation(getPatientListService, {
    onSuccess(result) {
      try {
        const { data } = result;
        if (data?.status == 200) {
          if (_.isEqual([[]], data.data)) {
            setPatientList([]);
          } else {
            setPatientList((prev) => [...prev, ...data.data]);
          }
        }
      } catch (err) {
        console.log("Error in fetching patient list", err);
      }
    },
  });

  const dispatch = useDispatch();

  const navigate = (data: PatientListObjectType) => {
    dispatch(setPatientId(data.id));
    dispatch(assignPatientDetails(data));
    navigation.navigate(NavigationList.billing as never);
  };

  const onPageEndReach = () => {
    // console.log("api called---------->", page == 0 ? limit : page + limit);
    if (patiantList?.length > 7) {
      setPage((prev) => (prev == 0 ? limit : prev + limit));
      mutate({
        params: searchText,
        limit: `start=${page == 0 ? limit : page + limit}&limit=${limit}`,
      });
    }
  };

  const handleSearch = (text: string) => {
    setPage(0);
    mutate({
      params: text,
      limit: `start=${page}&limit=${limit}`,
    });
  };

  const debouncedSearch = useCallback(_.debounce(handleSearch, 500), []);

  const handleTextChange = (text: string) => {
    setPatientList([])
    setSearchText(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setSearchText("");
    setPatientList([])
    mutate({
      params: "",
      limit: `start=${page}&limit=${limit}`,
    });
  };

  useEffect(() => {
    mutate({
      params: "",
      limit: `start=${page}&limit=${limit}`,
    });
  }, []);

  useEffect(() => {
    return () => {
      setSearchText("");
      setPage(0);
    };
  }, []);
  return (
    <View>

      {/* <AddInvoice/> */}

      
      <View style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 0 }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 4,
          }}
        >
          <TextInput
            mode="outlined"
            placeholder="Search patients..."
            value={searchText}
            onChangeText={handleTextChange}
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
                disabled={isLoading}
                icon={() =>
                  isLoading && searchText != "" ? (
                    <ActivityIndicator
                      animating={true}
                      color={colorList.primary}
                    />
                  ) : (
                    <Icons name="close" color={colorList.dark} size={25} />
                  )
                }
              />
            }
            style={{
              backgroundColor: colorList.white,
              color: colorList.Grey1,
              flex: 1,
            }}
          />
        </View>
      </View>
      <View style={{ height: Dimensions.get("screen").height - 272 }}>
        <FlatList
          style={{ paddingHorizontal: 1, paddingBottom: 10 }}
          data={patiantList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }: { item: PatientListObjectType }) => (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigate(item);
                }}
              >
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
                        style={{
                          marginLeft: 5,
                          borderWidth: 0.5,
                          borderColor: colorList.Grey1,
                        }}
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
          onEndReached={onPageEndReach}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            isLoading ? <CustomContentLoader listSize={8} /> : null
          }
        />
      </View>
    </View>
  );
}

export default BillingPatientList;
