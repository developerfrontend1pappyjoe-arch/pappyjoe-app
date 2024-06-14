import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {styles} from '../home.style';
import {
  ArrowRightSmIcon,
  CloseIcon,
  DownArrowIcon,
  LogoImage,
  LogoMainImage,
} from '../../../assets';
import {CustomModal} from '../../../components/CustomModal';
import {memo, useEffect, useState} from 'react';

import {API_URL} from '../../../utils/constants';
import {CustomLoaderRound} from '../../../components/CustomLoaderRound';
import {useDispatch, useSelector} from 'react-redux';
import {addLoginDetails} from '../../../redux/actions';
import {headerStyles} from './Header.styles';
import {getClinicDetails} from '../services/getClinicDetails';
import {NoDataAvailable} from '../../../components/NoDataAvailable';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const HomeHeader = memo(({refetch}: any) => {
  const dispatch = useDispatch();
  const [isPopup, setPopup] = useState(false);
  const [currentClinic, setCurrentClinic] = useState(null);
  const [clinicList, setClinicList] = useState([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const loginDetails = useSelector<any>(state => state.loginData);

  const saveLoginDataToStore = (data: any) => dispatch(addLoginDetails(data));

  useEffect(() => {
    getClinicList();
  }, [loginDetails]);

  const getClinicList = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get(`${API_URL.clinicList}`);
      if (data) {
        setLoading(false);
        const result = data?.data.filter(
          (lis: any) =>
            lis.Clinic_Name === loginDetails?.clinic_details?.clinic_name,
        )[0];
        setCurrentClinic(result);
        setClinicList(data?.data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Errors ====> get Clinic List in Home', error);
      setClinicList([]);
      setCurrentClinic(null);
    }
  };

  const handleChooseClinic = async (item: any) => {
    const clinic = await getClinicDetails(item?.Unique_Id);

    const obj = {
      ...loginDetails,
    };

    obj.clinic_details.clinic_name = item?.Clinic_Name;
    obj.Authorization_Bearer = clinic?.data?.Authorization_Bearer;

    saveLoginDataToStore(obj);
    setTimeout(() => {
      refetch();
      setPopup(false);
    }, 1000);
  };

  return (
    <View style={styles.HeaderContainer}>
      <Image source={LogoMainImage} style={styles.HeaderImage} />
      <TouchableOpacity
        style={styles.HeaderDropdownWrapper}
        onPress={() => setPopup(true)}>
        <Text style={styles.HeaderDropdownText}>
          {loginDetails?.clinic_details?.clinic_name}
        </Text>
        <Image source={DownArrowIcon} style={styles.HeaderDropdownIcon} />
      </TouchableOpacity>

      <CustomModal show={isPopup} close={() => setPopup(false)}>
        <TouchableOpacity
          style={{marginBottom: 25}}
          onPress={() => setPopup(false)}>
          <Image
            source={CloseIcon}
            style={{
              width: 18,
              height: 18,
              resizeMode: 'contain',
              position: 'absolute',
              right: -10,
              top: -10,
              margin: 5,
            }}
          />
        </TouchableOpacity>
        <ScrollView
          style={{
            maxHeight: Dimensions.get('screen').height * 0.5,
            width: Dimensions.get('screen').width * 0.8,
          }}
          showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <CustomLoaderRound />
          ) : clinicList?.length ? (
            clinicList?.map((item: any) => {
              return (
                <TouchableOpacity
                  key={item?.Unique_Id}
                  onPress={() => {
                    handleChooseClinic(item);
                  }}>
                  <View style={headerStyles.clinicLabelTextContaine}>
                    <View>
                      <Text style={headerStyles.clinicLabel}>
                        {item?.Clinic_Name || 'N.A'}
                      </Text>
                      <Text style={headerStyles.clinicText}>
                        {`ID : ${item?.Unique_Id || 'N.A'}`}
                      </Text>
                    </View>
                    <Image source={ArrowRightSmIcon} />
                  </View>
                  <View style={headerStyles.hrLine} />
                </TouchableOpacity>
              );
            })
          ) : (
            <NoDataAvailable />
          )}
        </ScrollView>
      </CustomModal>
    </View>
  );
});
