import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
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
import { NoDataAvailable } from "components/NoDataAvailable";
const limit = 10;
function BillingPatientList() {
  const [searchParams, setSearchParams] = useState({
    search: "",
    start: 0,
    limit: 15,
  });
  const [patientList, setPatientList] = useState<PatientListObjectType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);
  const navigation = useNavigation();
  const { mutate: getPatientListApi, isLoading } = useMutation(
    getPatientListService,
    {
      onSuccess(result) {
        isFetching.current = false;
        if (result?.status >= 200 && result?.status < 300) {
          setRefreshing(false);
          if (_.isEqual([[]], result.data)) {
            setPatientList([]);
          } else {
            if (!_.isEqual(result?.data || [], patientList)) {
              setPatientList((prev) =>
                searchParams.start === 0
                  ? [...result.data]
                  : [...prev, ...result.data]
              );
              // setPatientList([])
            }
          }
        } else {
          setPatientList([]);
        }
      },
    }
  );

  const dispatch = useDispatch();

  const navigate = (data: PatientListObjectType) => {
    dispatch(setPatientId(data.id));
    dispatch(assignPatientDetails(data));
    navigation.navigate(NavigationList.billing as never);
  };

  const onPageEndReach = () => {
    if (
      isFetching.current ||
      patientList.length < searchParams.limit ||
      isLoading
    )
      return;
    isFetching.current = true;
    const update = {
      ...searchParams,
      start: searchParams.start + searchParams.limit,
    };
    setSearchParams(update);
    getPatientListApi(update);
  };
  const searchCall = (search: string) => {
    getPatientListApi({ ...searchParams, start: 0, search });
  };
  const debouncedSearch = useCallback(_.debounce(searchCall, 500), []);

  const handleTextChange = (search: string) => {
    const update = { ...searchParams, start: 0, search };
    setPatientList([]);
    setSearchParams(update);
    debouncedSearch(search);
  };

  const clearSearch = () => {
    const update = { ...searchParams, search: "", start: 0 };
    setSearchParams(update);
    getPatientListApi(update);
  };

  const onRefresh = () => {
    setRefreshing(true);
    clearSearch();
  };

  useEffect(() => {
    getPatientListApi(searchParams);
    return () => {
      setSearchParams({
        search: "",
        start: 0,
        limit: 15,
      });
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorList.white }}>
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
            value={searchParams.search}
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
                icon={() => (
                  <Icons name="close" color={colorList.dark} size={25} />
                )}
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
      <View style={{ flex: 1, paddingVertical: 5 }}>
        {isLoading && searchParams.start === 0 ? (
          <CustomContentLoader listSize={10} />
        ) : Boolean(patientList?.length) ? (
          <FlatList
            style={{ paddingHorizontal: 1, paddingBottom: 10 }}
            data={patientList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: PatientListObjectType }) => (
              <>
                <TouchableOpacity
                style={{paddingHorizontal:4}}
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
                      <Text style={{ fontSize: 11 }}>
                        Mobile : {item.mobile}
                      </Text>
                    }
                    right={() => (
                      <Text style={{ fontSize: 12 }}>
                        ID : {item.Patient_Id}
                      </Text>
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
                        color={colorList.white}
                          style={{ marginLeft: 3,backgroundColor: colorList.palette.primary.main }}
                          size={40}
                          label={item.Name[0]}
                        />
                      )
                    }
                  />
                </TouchableOpacity>
              </>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={onPageEndReach}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() =>
              isLoading ? <CustomContentLoader listSize={8} /> : null
            }
          />
        ) : (
          !isLoading && patientList.length === 0 && <NoDataAvailable refresh={clearSearch} />
        )}
      </View>
    </SafeAreaView>
  );
}

export default BillingPatientList;
