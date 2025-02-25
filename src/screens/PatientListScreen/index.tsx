import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icons from "react-native-vector-icons/MaterialIcons";
import _ from "lodash";

// import {CustomHeader} from '../../components/CustomHeader';
import { colorList } from "../../styles/global.styles";

import { styles } from "./patientlist.styles";
import { getPatientListService } from "./service/patientList.service";
import { NavigationList } from "../../routes/NavigationList";
import { PatientList } from "./components/PatientList";
import { TextInput } from "react-native-paper";
import { NavigationProps } from "types/CommonTypes";
import { CustomContentLoader } from "components/CustomContentLoader";
import { NoDataAvailable } from "components/NoDataAvailable";

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
      {/* <TextInput
        placeholder="Search here"
        value={searchParams}
        onChangeText={text => setSearchParams(text)}
        placeholderTextColor={colorList.Grey4}
        style={{
          backgroundColor: colorList.white,
          color: colorList.Grey1,
          flex: 1,
        }}
      /> */}
      {/* <Button  mode="text" onPress={clearSearch}>
        <Text style={{fontSize: 20}}>X</Text>
      </Button> */}
    </View>
  );
};

const PatientListScreen: React.FC<NavigationProps> = memo(({ navigation }) => {
  const [searchParams, setSearchParams] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [patiantList, setPatientList] = useState([]);
  const [page, setPage] = useState(1);

  // useFocusEffect(
  //   useCallback(() => {
  //     getPatientListApi();
  //     return () => {
  //       // console.log('Un Foxuzzed In Patient Listing ');

  //       setSearchParams("");
  //       setPatientList([]);
  //       setPage(1);
  //     };
  //   }, [])
  // );

  // const onRefresh = useCallback(() => {
  //   if (refreshing) setPage(1);
  //   getPatientListApi();
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, []);

  const clearSearch = () => {
    // setPatientList([]);
    setSearchParams("");
  };

  const getPatientListApi = async () => {
    try {
      setLoading(true);
      const { data } = await getPatientListService({
        params: searchParams,
        limit: `start=${page === 1 ? 0 : page * 10 - 11}&limit=10`,
      });

      if (data?.status == 200) {
        if (_.isEqual([[]], data.data)) {
          setPatientList([]);
        } else {
          const newData =
            searchParams !== "" ? data?.data : [...patiantList, ...data.data];
          setPatientList(newData);
        }
        setRefreshing(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // console.log('Un Foxuzzed In Patient Listing ');

      setSearchParams("");
      setPatientList([]);
      setPage(1);
    };
  }, []);

  useEffect(() => {
    if (searchParams === "") {
      setPatientList([]);
      setPage(1);
    }
    getPatientListApi();
  }, [page,searchParams]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorList.white }}>
      <>
        <View>
          <View
            style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 0 }}
          >
            <SearchInput
              setSearchParams={setSearchParams}
              searchParams={searchParams}
              clearSearch={clearSearch}
            />
          </View>
          <View
            style={{
              paddingVertical: 5,
              height: Dimensions.get("screen").height - 272,
            }}
          >
            {isLoading && page === 1 ? (
              <CustomContentLoader listSize={20} />
            ) : patiantList?.length > 0 ? (
              <FlatList
                data={patiantList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }: any) => (
                  <PatientList
                    data={item}
                    navigate={() =>
                      navigation.navigate(NavigationList.appoinmentDetails, {
                        patientId: item.id,
                        from: "patient-list",
                      })
                    }
                  />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={getPatientListApi}
                  />
                }
                onEndReached={() => {
                  patiantList?.length > 7 && setPage(page + 1);
                }}
                ListFooterComponent={() =>
                  isLoading ? <CustomContentLoader listSize={10} /> : null
                }
              />
            ) : (
              !isLoading && <NoDataAvailable />
            )}
          </View>
        </View>
      </>
    </SafeAreaView>
  );
});

PatientListScreen.displayName = "PatientListScreen";

export default PatientListScreen;
