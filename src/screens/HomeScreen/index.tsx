import React, {useState, useCallback, useEffect, memo} from 'react';
import {
  Text,
  View,
  RefreshControl,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';

import {HomeHeader} from './components/Header';
import {FilterSection} from './components/FilterSection';

// import axios from 'axios';
import {API_URL} from '../../utils/constants';
import {FlatList} from 'react-native';
import {CounterContainer} from './components/CounterContainer';
import {AppoinmentList} from './components/AppoinmentList';
import {NavigationList} from '../../routes/NavigationList';
import {useDispatch, useSelector} from 'react-redux';
import {NoDataAvailable} from '../../components/NoDataAvailable';
// import '../../config/axios.config';
import {axiosInstance as axios} from '../../config/axios.config.custom';
import {CustomLoaderRound} from '../../components/CustomLoaderRound';
import {handleHomeAppoinmentFilter} from '../../redux/actions';
import {useFocusEffect} from '@react-navigation/native';

export const HomeScreen = memo(({navigation}: any) => {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState('0');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [isFilterOn, setIsFilterOn] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [appoinmentList, setAppoinmentList] = useState(null);

  const homeAppoinmentFilter = useSelector<any>(
    state => state.homeAppoinmentFilter,
  );

  useEffect(() => {
    getAppoinments();
    return () => {
      setRefetch(false);
    };
  }, [isFocused, refetch]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      getAppoinments();
      return () => {
        console.log('Screen unfocused');
      };
    }, []),
  );

  const handleSetFilterParamsToday = () => {
    const temp = {...homeAppoinmentFilter};
    temp.from_date = moment().format('DD-MM-YYYY');
    temp.to_date = moment().format('DD-MM-YYYY');
    dispatch(handleHomeAppoinmentFilter(temp));
  };

  const handleSetFilterParamsUpcomming = () => {
    const temp = {...homeAppoinmentFilter};
    temp.from_date = moment().add(1, 'day').format('DD-MM-YYYY');
    temp.to_date = '';
    dispatch(handleHomeAppoinmentFilter(temp));
  };

  const convertParamsToQueryString = (params: any) => {
    const filteredParams = Object.entries(params)
      ?.filter(([key, value]) => value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const queryString = new URLSearchParams(filteredParams).toString();
    return queryString;
  };

  const getAppoinments = async () => {
    try {
      setLoading(true);
      const params = {...homeAppoinmentFilter};
      params.limit = 300;
      // params.start = page === 1 ? 0 : page * 10 - 11;

      const Url = `${API_URL.appointments}?${convertParamsToQueryString(
        params,
      )}`;

      console.log('URL -----> ', Url);

      const {data} = await axios.get(Url);
      if (data) {
        handleFilterIsOn();
        setAppoinmentList(data);
        setRefetch(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Errors ====> getAppoinments', error);
    }
  };

  const handleFilterIsOn = () => {
    let count = 0;
    Object.values(homeAppoinmentFilter)?.forEach(el => {
      if (el !== '') count += 1;
    });
    if (count > 2) {
      setIsFilterOn(true);
    } else setIsFilterOn(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: 15,
        }}>
        <HomeHeader refetch={() => setRefetch(true)} />

        <FilterSection
          refetch={() => setRefetch(true)}
          isFocused={isFocused}
          showFilterPopup={showFilterPopup}
          setShowFilterPopup={setShowFilterPopup}
          resetToday={handleSetFilterParamsToday}
          resetUpcomming={handleSetFilterParamsUpcomming}
          isFilter={isFilterOn}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <CounterContainer
            isFocused={isFocused}
            value="0"
            setIsFocused={() => {
              setIsFocused('0');
              handleSetFilterParamsToday();
            }}
            text="Today's"
            count={appoinmentList?.count}
            loading={isLoading}
          />
          <CounterContainer
            value="1"
            isFocused={isFocused}
            setIsFocused={() => {
              setIsFocused('1');
              handleSetFilterParamsUpcomming();
            }}
            text="Upcoming"
            count={appoinmentList?.count}
            loading={isLoading}
          />
        </View>

        <View style={{flex: 1, paddingHorizontal: 5}}>
          {isLoading ? (
            <CustomLoaderRound />
          ) : appoinmentList?.data ? (
            <FlatList
              data={appoinmentList?.data}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({item}: any) => (
                <AppoinmentList
                  data={{...item, ...{isFocused: isFocused}}}
                  {...navigation}
                  navigate={() =>
                    navigation.navigate(NavigationList.appoinmentDetails, {
                      patientId: item?.Patient_Id,
                      appointmentDetails: item,
                    })
                  }
                  refetch={() => setRefetch(true)}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refetch}
                  onRefresh={() => setRefetch(true)}
                />
              }
              onEndReached={() => setPage(page + 1)}
            />
          ) : (
            <View
              style={{
                minHeight: 400,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataAvailable />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';
