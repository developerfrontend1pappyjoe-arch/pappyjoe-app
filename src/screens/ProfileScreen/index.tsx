import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {CustomHeader} from '../../components/CustomHeader';
import {
  ArrowLeftIcon,
  ArrowRightLgIcon,
  ArrowRightSmIcon,
  ArrowUpIcon,
  HelpIcon,
  LockIcon,
  LogOutIcon,
  ReportsIcon,
  SethescopeIcon,
} from '../../assets';
import {styles} from './profile.styles';
import {API_URL} from '../../utils/constants';
import {useQuery} from '@tanstack/react-query';
import {CustomLoaderRound} from '../../components/CustomLoaderRound';
import {NavigationList} from '../../routes/NavigationList';
import {useDispatch} from 'react-redux';
import {removeLoginDetails} from '../../redux/actions';
import {axiosInstance as axios} from '../../config/axios.config.custom';

const ClinicList = () => {
  const getClinicList = async (params: any) => {
    try {
      const res = await axios.get(API_URL.clinicList);
      return res;
    } catch (error) {
      console.error('Errors ====> get Clinic List', error);
      throw error;
    }
  };

  const {data, isLoading, isFetching} = useQuery({
    queryKey: ['clinicLists'],
    queryFn: getClinicList,
  });

  return (
    <View style={styles.clinickContainer}>
      <View style={styles.clicnicHeadContainer}>
        <Text style={styles.clinicHeading}>My Clinics</Text>
        <Image source={ArrowUpIcon} />
      </View>

      <View style={styles.hrLine} />

      <ScrollView
        style={{
          maxHeight:
            data?.data?.data?.length > 5
              ? Dimensions.get('screen').height * 0.5
              : Dimensions.get('screen').height * 0.25,
        }}
        showsVerticalScrollIndicator={false}>
        {isLoading || isFetching ? (
          <CustomLoaderRound />
        ) : (
          data?.data?.data?.map((item: any) => {
            return (
              <View key={item?.Unique_Id}>
                <TouchableOpacity
                  style={styles.clinicLabelTextContaine}
                  onPress={() => Alert.alert('Coming Soon')}>
                  <View>
                    <Text style={styles.clinicLabel}>
                      {item?.Clinic_Name || 'N.A'}
                    </Text>
                    <Text style={styles.clinicText}>
                      {`ID : ${item?.Unique_Id || 'N.A'}`}
                    </Text>
                  </View>
                  <Image source={ArrowRightSmIcon} />
                </TouchableOpacity>
                <View style={styles.hrLine} />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* <TouchableOpacity
        style={styles.addMoreClicnicBtnContainer}
        onPress={() => Alert.alert('Comming Soon')}>
        <Text style={styles.addMoreClicnicBtn}>+ Add More Clinics</Text>
      </TouchableOpacity> */}
    </View>
  );
};
interface FeatureListTypes  {
  id: number;
  label: string;
  icon: any;
  navigate: any;
};

const ProfileFeatersList = ({navigation}: any) => {
  const dispatch = useDispatch();
  const logouts = () => dispatch(removeLoginDetails());

  const handleLogout = async () => {
    navigation();
    // console.log('navigation ====> ', navigation());

    setTimeout(() => {
      logouts();
      //   CommonActions.reset({index: 0, routes: [{name: NavigationList.auth}]});
    }, 500);
  };

  const list: FeatureListTypes[] = [
    // {id: 1, label: 'Appointments', icon: SethescopeIcon, navigate: null},
    // {id: 2, label: 'Reports', icon: ReportsIcon, navigate: null},
    // {id: 3, label: 'Change Password', icon: LockIcon, navigate: null},
    // {id: 4, label: 'Help', icon: HelpIcon, navigate: null},
    {id: 5, label: 'Log Out', icon: LogOutIcon, navigate: () => handleLogout()},
  ];

  return (
    <ScrollView>
      {list?.map(item => {
        return (
          <TouchableOpacity
            key={item?.id}
            style={styles.profMainContainer}
            onPress={() =>
              item.navigate ? item.navigate() : Alert.alert('Coming Soon')
            }>
            <View style={styles.profIconLabelContainer}>
              <View style={styles.profIconContainer}>
                <Image source={item?.icon} style={styles.profFeatureIcon} />
              </View>
              <Text style={styles.profFeaturelabel}>{item?.label}</Text>
            </View>
            <Image source={ArrowRightLgIcon} style={styles.profFeatureIcon2} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export const ProfileScreen = ({navigation}: any) => {
  const logoutNavigation = () => {
    navigation.navigate(NavigationList.welcome);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomHeader headerText="My Profile" />
      <View style={styles.container}>
        <ClinicList />
        <ProfileFeatersList navigation={logoutNavigation} />
      </View>
    </SafeAreaView>
  );
};
