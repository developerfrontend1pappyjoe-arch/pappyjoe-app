import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';

import {
  AddIcon,
  CloseLargeImage,
  CommingSoonIcon,
  HomeFillIcon,
  HomeIcon,
  PatientListFillIcon,
  PatientListIcon,
  ProfileIcon,
} from '../assets';
import {colorList} from '../styles/global.styles';
import {NavigationList} from '../routes/NavigationList';
import {CustomModal} from './CustomModal';
import {Button} from 'react-native-paper';

const AddAllModal = ({closeModal, navigate}: any) => {
  return (
    <View style={{}}>
      <View
        style={{
          padding: 10,
          borderRadius: 10,
          width: Dimensions.get('screen').width * 0.8,
          height: Dimensions.get('screen').height * 0.15,
          position: 'relative',
        }}>
        {/* <View style={{position: 'relative'}}>
          <Button>
            <Image source={CloseLargeImage} style />
          </Button>
        </View> */}
        <TouchableOpacity
          onPress={() => {
            closeModal();
            navigate(NavigationList.bookingAppoinment);
          }}
          style={{
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorList.primary,
            marginBottom: 15,
          }}>
          <Text style={{fontSize: 18, padding: 10, color: colorList.white}}>
            New Appointment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            closeModal();
            navigate(NavigationList.addpatient);
          }}
          style={{
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorList.socondary,
          }}>
          <Text style={{fontSize: 18, padding: 10, color: colorList.white}}>
            New Patient
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const CustomTabBar = ({navigation}: any) => {
  const [index, setIndex] = useState(1);
  const handleClickRoute = (route: any, index: number) => {
    setIndex(index);
    navigation.navigate(route);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        justifyContent: 'space-evenly',
        paddingVertical: 8,
      }}>
      <TouchableOpacity
        accessibilityRole="button"
        style={[styles.wrapper]}
        onPress={() => handleClickRoute(NavigationList.home, 1)}>
        <Image
          source={index === 1 ? HomeFillIcon : HomeIcon}
          style={[styles.iconStyle]}
        />
        <Text
          style={[
            styles.labelStyle,
            index === 1 && {color: colorList.primary},
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => handleClickRoute(NavigationList.patientList, 2)}>
        <Image
          source={index === 2 ? PatientListFillIcon : PatientListIcon}
          style={styles.iconStyle}
        />
        <Text
          style={[
            styles.labelStyle,
            index === 2 && {color: colorList.primary},
          ]}>
          Patient List
        </Text>
      </TouchableOpacity>

      <View style={styles.wrapper}>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.customAddButtonWrapper}
          onPress={openModal}>
          <Image source={AddIcon} style={styles.customAddButton} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => handleClickRoute(NavigationList.commingSoon, 3)}>
        <Image source={CommingSoonIcon} style={styles.iconStyle} />
        <Text
          style={[
            styles.labelStyle,
            index === 3 && {color: colorList.primary},
          ]}>
          Coming Soon
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        style={styles.wrapper}
        onPress={() => handleClickRoute(NavigationList.profile, 4)}>
        <Image source={ProfileIcon} style={styles.iconStyle} />
        <Text
          style={[
            styles.labelStyle,
            index === 4 && {color: colorList.primary},
          ]}>
          Profile
        </Text>
      </TouchableOpacity>

      <CustomModal close={closeModal} show={isModalVisible}>
        <AddAllModal closeModal={closeModal} {...navigation} />
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    flex: 1,
  },
  customAddButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorList.socondary,
    borderRadius: 10,
    width: 50,
    height: 50,
    position: 'relative',
    top: -30,
  },
  customAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  labelStyle: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 9,
    marginTop: 5,
    color: colorList.Grey1,
  },
});
