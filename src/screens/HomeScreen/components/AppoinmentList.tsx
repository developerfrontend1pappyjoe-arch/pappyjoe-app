import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useMutation} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MetrialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  Text,
  Surface,
  Portal,
  Modal,
  TextInput,
  Button,
} from 'react-native-paper';

import {styles} from '../home.style';
import {colorList} from '../../../styles/global.styles';
import {CustomModal} from '../../../components/CustomModal';
import {updateQueueStatus} from '../../../services/updateQueueStatus';
import {CustomLoaderRound} from '../../../components/CustomLoaderRound';
import {API_URL} from '../../../utils/constants';
import {axiosInstance as axios} from '../../../config/axios.config.custom';
import {checkCountryCode} from 'utils/commonUtils';

const ICON = {
  action: moderateScale(20),
  meta: moderateScale(16),
  doctor: moderateScale(20),
};

const queueStatusColor: Record<string, string> = {
  Scheduled: colorList.Grey1,
  Waiting: colorList.primary,
  Engaged: colorList.socondary,
  Checkout: colorList.warning,
};

const appointmentStatusTheme: Record<string, {bg: string; text: string}> = {
  Scheduled: {bg: colorList.blue_900, text: colorList.primary},
  Cancelled: {bg: colorList.palette.error.light, text: colorList.palette.error.main},
  Consulted: {bg: colorList.Green, text: colorList.socondary},
  Waiting: {bg: colorList.blue_900, text: colorList.primary},
  Engaged: {bg: colorList.Green, text: colorList.socondary},
  Checkout: {bg: colorList.palette.warning.light, text: colorList.palette.warning.main},
};

const queueStatusList = [
  {id: 1, name: 'waiting', label: 'Waiting'},
  {id: 2, name: 'engage', label: 'Engage'},
  {id: 3, name: 'checkout', label: 'Checkout'},
];

const getAppointmentStatusTheme = (status: string) =>
  appointmentStatusTheme[status] ?? {
    bg: colorList.Grey5,
    text: colorList.GreyDark1,
  };

export const AppoinmentList = ({data, navigate, refetch}: any) => {
  const [isCancelNote, setIsCancelNote] = useState(false);
  const [cancelNote, setCancelNote] = useState('');
  const [openQueueModal, setQueueModal] = useState(false);

  const statusTheme = getAppointmentStatusTheme(data?.Appointment_Status);
  const queueColor =
    queueStatusColor[data?.queue_status] ?? colorList.primary;

  const {mutate, isLoading} = useMutation(updateQueueStatus, {
    onSuccess: result => {
      if (result?.status == 200) {
        setQueueModal(false);
        setIsCancelNote(false);

        cancelNote != ''
          ? Alert.alert('Success', result?.message, [
              {text: 'Ok', onPress: () => refetch()},
            ])
          : refetch();
      } else {
        Alert.alert('Warning', result?.message || 'Somthing went wrong', [
          {text: 'Ok'},
        ]);
      }
    },
    onError: (err: any) => {
      setQueueModal(false);
      setIsCancelNote(false);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Something went wrong !',
      );
    },
  });

  const openDialer = () =>
    Linking.openURL(
      `tel:+${checkCountryCode(data?.Patient_country_code)}${data?.Patient_Mobile}`,
    );

  const openWhatsApp = () => {
    try {
      Linking.openURL(
        `whatsapp://send?text=Hai&phone=${data?.Patient_country_code}${data?.Patient_Mobile}`,
      );
    } catch (err) {
      console.error('err ===== ', err);
      Alert.alert('No Whatsapp Found');
    }
  };

  const handlZoomLinkApi = (appointmentData: any) => {
    try {
      const Url = `${API_URL.getZoomLink}?pid=${appointmentData?.Patient_Id}`;
      axios
        .get(Url)
        .then(res => {
          if (res.data?.status == 200) {
            Linking.openURL(`${res.data?.data[0]?.url}`);
          }
        })
        .catch(err => {
          Alert.alert('Error', err?.response?.data?.message);
        });
    } catch (err) {
      console.error('error in handlZoomLinkApi', err);
    }
  };

  const handleChangeQueueStatus = (status: string) => {
    const formData = new FormData();
    formData.append('app_id', data?.Appointment_Id);
    formData.append('queuestatus', status);
    mutate({payload: formData, method: 'put'});
  };

  const handleCancelAppoinmentsApi = () => {
    setIsCancelNote(false);
    const formData = new FormData();
    formData.append('app_id', data?.Appointment_Id);
    formData.append('reason', cancelNote);
    mutate({payload: formData, method: 'delete'});
  };

  const handleCancelAppoinments = () => {
    Alert.alert(
      'Warning',
      'Are you sure, you want to cancel this Appointment ?',
      [
        {text: 'Cancel', onPress: () => {}},
        {text: 'Confirm', onPress: () => setIsCancelNote(true)},
      ],
    );
  };

  if (isLoading) {
    return <CustomLoaderRound />;
  }

  const showQueueBadge =
    data?.Appointment_Status != 'Cancelled' && data?.isFocused != '1';

  return (
    <Surface style={styles.appoinmentContainer}>
      <View style={styles.appoinmentHeader}>
        <View
          style={[
            styles.appoinmentStatusChip,
            {backgroundColor: statusTheme.bg},
          ]}>
          <Text
            style={[
              styles.appoinmentStatusChipText,
              {color: statusTheme.text},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {data?.Appointment_Status}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCancelAppoinments}
          style={styles.appoinmentCancelButton}
          hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
          <Text style={styles.appoinmentCancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.appoinmentPatientRow}
        activeOpacity={0.85}
        onPress={navigate}>
        <View style={styles.appoinmentPatientInfo}>
          <Text style={styles.appoinmentNameLabel}>Patient</Text>
          <Text
            style={styles.appoinmentNameText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {data?.Patient_Name}
          </Text>
        </View>

        <View style={styles.appoinmentActions}>
          <TouchableOpacity
            onPress={openWhatsApp}
            style={styles.appoinmentIconButton}
            hitSlop={4}>
            <Icon
              name="whatsapp"
              color={colorList.socondary}
              size={ICON.action}
            />
          </TouchableOpacity>

          {Platform.OS !== 'ios' && (
            <TouchableOpacity
              style={[
                styles.appoinmentIconButton,
                styles.appoinmentIconButtonPrimary,
              ]}
              onPress={() => handlZoomLinkApi(data)}
              hitSlop={4}>
              <Icon color={colorList.white} size={ICON.action} name="video" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={openDialer}
            style={styles.appoinmentIconButton}
            hitSlop={4}>
            <Icon color={colorList.primary} size={ICON.action} name="phone" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={navigate}
        style={styles.appoinmentMetaRow}>
        <View style={styles.appoinmentMetaItem}>
          <Icon
            name="calendar-month-outline"
            size={ICON.meta}
            color={colorList.primary}
          />
          <Text
            style={styles.appoinmentDate}
            numberOfLines={1}
            ellipsizeMode="tail">
            {data?.Appointment_Date}
          </Text>
        </View>

        <View style={styles.appoinmentMetaDivider} />

        <View style={styles.appoinmentMetaItem}>
          <Icon
            name="clock-time-five-outline"
            size={ICON.meta}
            color={colorList.primary}
          />
          <Text style={styles.appoinmentTime} numberOfLines={1}>
            {data?.Appointment_Time}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.appoinmentFooterRow}>
        <TouchableOpacity
          onPress={navigate}
          style={styles.appoinmentDoctorRow}
          activeOpacity={0.85}>
          <View style={styles.appoinmentDoctorAvatar}>
            <MetrialIcon
              name="person"
              size={ICON.doctor}
              color={colorList.primary}
            />
          </View>
          <View style={styles.appoinmentToLabelTextContainer}>
            <Text style={styles.appoinmentToLabel}>Doctor</Text>
            <Text
              style={styles.appoinmentToText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {data?.Doctor_Name}
            </Text>
          </View>
        </TouchableOpacity>

        {showQueueBadge && (
          <TouchableOpacity
            onPress={() => setQueueModal(true)}
            style={styles.appoinmentQueueBadge}
            hitSlop={6}>
            <Text
              style={[styles.appoinmentQueueBadgeText, {color: queueColor}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {data?.queue_status}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {openQueueModal && (
        <CustomModal close={() => setQueueModal(false)} show={openQueueModal}>
          <View style={styles.appoinmentQueueModalContent}>
            {queueStatusList.map(list => (
              <TouchableOpacity
                key={list.id}
                onPress={() => handleChangeQueueStatus(list.name)}
                style={styles.appoinmentQueueModalOption}>
                <Text style={styles.appoinmentQueueModalOptionText}>
                  {list.label}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.appoinmentQueueModalDivider} />
            <Button onPress={() => setQueueModal(false)}>Close</Button>
          </View>
        </CustomModal>
      )}

      <Portal>
        <Modal
          visible={isCancelNote}
          onDismiss={() => setIsCancelNote(false)}
          style={styles.appoinmentCancelModal}>
          <View style={styles.appoinmentCancelModalContent}>
            <Text style={styles.appoinmentCancelModalTitle}>
              Reason For Cancel
            </Text>
            <View style={styles.appoinmentCancelModalBody}>
              <TextInput
                placeholder="Enter cancellation reason"
                mode="outlined"
                onChangeText={text => setCancelNote(text)}
              />
              <Text style={styles.appoinmentCancelRequiredText}>* Required</Text>
              <View style={styles.appoinmentCancelModalActions}>
                <Button
                  mode="outlined"
                  textColor={colorList.GreyDark1}
                  onPress={() => setIsCancelNote(false)}>
                  Dismiss
                </Button>
                <Button
                  mode="contained"
                  buttonColor={colorList.palette.error.main}
                  textColor={colorList.white}
                  onPress={() =>
                    cancelNote !== '' && handleCancelAppoinmentsApi()
                  }>
                  Submit
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Surface>
  );
};
