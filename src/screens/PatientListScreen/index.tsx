import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import Icons from "react-native-vector-icons/MaterialIcons";
import { Button, TextInput } from "react-native-paper";

import { colorList } from "../../styles/global.styles";
import { getPatientListService } from "./service/patientList.service";
import { NavigationList } from "../../routes/NavigationList";
import { PatientList } from "./components/PatientList";
import { CustomContentLoader } from "components/CustomContentLoader";
import { NoDataAvailable } from "components/NoDataAvailable";
import { NavigationProps } from "types/CommonTypes";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { StoreTypes } from "redux/reducer";
import { controlRefetch } from "redux/actions";

const SearchInput = ({ searchParams, onSearch, clearSearch }: any) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 10 }}>
      <TextInput
        mode="outlined"
        placeholder="Search patients..."
        value={searchParams}
        onChangeText={onSearch}
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

const PatientListScreen: React.FC<NavigationProps> = memo(({ navigation }) => {
  const [searchParams, setSearchParams] = useState({
    search: "",
    start: 0,
    limit: 15,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const isFetching = useRef(false); // Prevents duplicate API calls on `onEndReached`
  const refetch = useSelector((state: StoreTypes) => state.refetchPatientLit);
  const dispatch = useDispatch();
  const { mutate: getPatientListApi, isLoading } = useMutation(
    getPatientListService,
    {
      onSuccess: (result) => {
        isFetching.current = false;
        dispatch(controlRefetch(false));
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
      onError: (error) => {
        console.error("Error fetching patient list:", error);
        isFetching.current = false; // Reset fetch status on error
      },
    }
  );

  const clearSearch = () => {
    const update = { ...searchParams, search: "", start: 0 };
    setSearchParams(update);
    getPatientListApi(update);
  };

  const searchCall = (search: string) => {
    getPatientListApi({ ...searchParams, start: 0, search });
  };
  const debouncedSearch = useCallback(_.debounce(searchCall, 500), []);

  const handleSearch = (search: string) => {
    const update = { ...searchParams, start: 0, search };
    setPatientList([]);
    setSearchParams(update);
    debouncedSearch(search);
  };

  const onEndReach = () => {
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

  const onRefresh = () => {
    setRefreshing(true);
    clearSearch();
  };

  useEffect(()=>{
    getPatientListApi(searchParams);
  },[])

  useEffect(() => {
    if (refetch) {
      getPatientListApi(searchParams);
    }
  }, [refetch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorList.white }}>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
        <SearchInput
          onSearch={handleSearch}
          searchParams={searchParams.search}
          clearSearch={clearSearch}
        />
        <View style={{ flex: 1, paddingVertical: 5 }}>
          {isLoading && searchParams.start === 0 ? (
            <CustomContentLoader listSize={10} />
          ) : patientList.length > 0 ? (
            <FlatList
              data={patientList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <PatientList
                  data={item}
                  navigate={() =>
                    navigation.navigate(NavigationList.appoinmentDetails, {
                      patientId: item?.id || "",
                      patientData: item,
                      from: "patient-list",
                    })
                  }
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={onEndReach}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                isLoading ? <CustomContentLoader listSize={10} /> : null
              }
            />
          ) : (
            !isLoading &&
            patientList.length === 0 && (
              <NoDataAvailable refresh={clearSearch} />
            )
          )}
        </View>
      </View>
    </SafeAreaView>
  );
});

PatientListScreen.displayName = "PatientListScreen";

export default PatientListScreen;
