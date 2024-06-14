import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../home.style';
import {
  CalanderIcon,
  CallFillIcon,
  EditIcon,
  GoogleMeetIcon,
  SampleDrImage,
  TimerIcon,
  WhatsAppIcon,
  ZoomMeetingIcon,
} from '../../../assets';
import {colorList} from '../../../styles/global.styles';

interface CounterConatainerType {
  value: string;
  isFocused: string;
  setIsFocused: () => void;
  text: string;
  count: number;
  loading: boolean;
};

export const CounterContainer = ({
  value,
  isFocused,
  setIsFocused,
  text,
  count,
  loading,
}: CounterConatainerType) => {
  const focused = isFocused === value;
  return (
    <TouchableOpacity
      onPress={setIsFocused}
      style={[
        styles.counterContainer,
        {
          backgroundColor: focused ? colorList.socondary : colorList.white,
        },
      ]}>
      <Text style={focused ? styles.counterNumber : styles.counterNumber1}>
        {loading ? '...' : focused ? count || 0 : '...'}
      </Text>
      <Text style={focused ? styles.counterLabel : styles.counterLabel1}>
        {text}
      </Text>
      <Text style={focused ? styles.counterLabel : styles.counterLabel1}>
        Appointments
      </Text>
    </TouchableOpacity>
  );
};

export const AppoinmentList = ({data}: any) => {
  return (
    <View style={styles.appoinmentContainer}>
      <View style={styles.appoinmentNameSocial}>
        <View style={styles.appoinmentNameContainer}>
          <Text style={styles.appoinmentNameLabel}>Patient Name</Text>
          <Text style={styles.appoinmentNameText}>{data?.Patient_Name}</Text>
        </View>
        <View style={styles.appoinmentNameSocialContainer}>
          <Image source={CallFillIcon} />
          <Image source={WhatsAppIcon} />
          <Image source={GoogleMeetIcon} />
          <Image source={ZoomMeetingIcon} />
        </View>
      </View>
      <View style={styles.appoinmentDateTimeContainer}>
        <View style={styles.appoinmentCalanderContainer}>
          <Image source={CalanderIcon} />
          <Text style={styles.appoinmentDate}>{data?.Appointment_Date}</Text>
          <Image source={EditIcon} />
        </View>

        <View style={styles.appoinmentTimeContainer}>
          <Image source={TimerIcon} />
          <Text style={styles.appoinmentTime}>{data?.Appointment_Time}</Text>
          {/* <Text style={styles.appoinmentTime}>{data?.timeTo}</Text> */}
        </View>
      </View>

      <View style={styles.appoinmentHrizontalLine} />
      <View style={styles.appoinmentToContainer}>
        <Image
          source={SampleDrImage}
          style={{width: 28, height: 28, resizeMode: 'contain'}}
        />
        <View style={styles.appoinmentToLabelTextContainer}>
          <Text style={styles.appoinmentToLabel}>Appoint To</Text>
          <Text style={styles.appoinmentToText}>{data?.Doctor_Name}</Text>
        </View>
      </View>
    </View>
  );
};
