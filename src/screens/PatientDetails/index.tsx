import {View, Text, Image, SafeAreaView} from 'react-native';
import {
  AgeIcon,
  ArrowLeftIcon,
  GenderIcon,
  LocationIcon,
  MailGreyIcon,
  MailIcon,
  PrintIcon,
} from '../../assets';
import {CustomHeader} from '../../components/CustomHeader';
import {PatientDetailsTiles} from '../../components/PatientDetailsTiles';
import {styles} from './patientDetails.styles';
import {useQuery} from '@tanstack/react-query';
import {API_URL} from '../../utils/constants';
import {axiosInstance as axios} from '../../config/axios.config.custom';

export const PatientDetails = ({navigation, route: {params}}: any) => {
  const getPatientDetails = async () => {
    const res = await axios.get(`${API_URL.patientList}?pid=${params?.id}`);
    return res;
  };

  const {data, error, isLoading, isSuccess, isFetching} = useQuery({
    queryKey: ['patientDetails'],
    queryFn: getPatientDetails,
  });

  return (
    <SafeAreaView>
      <CustomHeader
        headerText={'Patient Details'}
        // rightIcon={PrintIcon}
        leftIcon={ArrowLeftIcon}
        leftIconAction={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <PatientDetailsTiles
          data={{
            Patient_Photo: data?.data?.data[0]?.Photo,
            Patient_Name: data?.data?.data[0]?.Name,
            Patient_Id: data?.data?.data[0]?.Patient_Id,
            Patient_Mobile: data?.data?.data[0]?.mobile,
            File_No: data?.data?.data[0]?.File_No,
            Patient_phone: data?.data?.data[0]?.phone,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <View style={[styles.labelTextContainer, {width: '48%'}]}>
            <Image source={AgeIcon} style={styles.labelIcon} />
            <Text style={styles.labelText}>
              {data?.data?.data[0]?.age || 'N.A'}
            </Text>
          </View>

          <View style={[styles.labelTextContainer, {width: '48%'}]}>
            <Image source={GenderIcon} style={styles.labelIcon} />
            <Text style={styles.labelText}>
              {data?.data?.data[0]?.gender || 'N.A'}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 12}}>
          <View style={[styles.labelTextContainer, {width: '100%'}]}>
            <Image source={MailGreyIcon} style={styles.labelIcon} />
            <Text style={styles.labelText}>
              {data?.data?.data[0]?.email || 'N.A'}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 12}}>
          <View style={[styles.labelTextContainer, {width: '100%'}]}>
            <Image source={LocationIcon} style={styles.labelIcon} />
            <Text style={styles.labelText}>
              {data?.data?.data[0]?.city || 'N.A'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
