import {
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';

import {styles} from '../home.style';
import {
  CalanderIcon,
  CallFillIcon,
  ProfileAvatar,
  TimerIcon,
  WhatsAppIcon,
  ZoomMeetingIcon,
} from '../../../assets';
import {colorList} from '../../../styles/global.styles';
import {useState} from 'react';
import {CustomModal} from '../../../components/CustomModal';
import {updateQueueStatus} from '../../../services/updateQueueStatus';
import {CustomLoaderRound} from '../../../components/CustomLoaderRound';

import {API_URL} from '../../../utils/constants';
import {
  Text,
  Surface,
  Portal,
  Modal,
  TextInput,
  Button,
} from 'react-native-paper';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const AppoinmentList = ({data, navigate, refetch}: any) => {
  const [isLoading, setLoading] = useState(false);

  const openDialer = () =>
    Linking.openURL(`tel:${data?.Patient_country_code}${data?.Patient_Mobile}`);

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
  const handlZoomLinkApi = (data: any) => {
    try {
      const Url = `${API_URL.getZoomLink}?pid=${data?.Patient_Id}`;
      axios
        .get(Url)
        .then(res => {
          if (res.data?.status == 200) {
            Linking.openURL(`${res.data?.data[0]?.url}`);
          }
          console.log('Rewsss Dataaaa', res?.data);
        })
        .catch(err => {
          Alert.alert('Error', err?.response?.data?.message);
        });
    } catch (err) {
      console.error('error in handlZoomLinkApi', err);
    }
  };

  const [openQueueModal, setQueueModal] = useState(false);
  const queueStatusList = [
    {id: 1, name: 'waiting', label: 'Waiting'},
    {id: 2, name: 'engage', label: 'Engage'},
    {id: 3, name: 'checkout', label: 'Checkout'},
  ];

  const handleChangeQueueStatus = (status: string) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('app_id', data?.Appointment_Id);
    formData.append('queuestatus', status);
    updateQueueStatus(formData)
      .then(res => {
        setLoading(false);
        setQueueModal(false);
        refetch();
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Error', err?.response?.data?.message);
      });
  };

  const handleCancelAppoinmentsApi = () => {
    setLoading(true);
    setIsCancelNote(false);
    const formData = new FormData();
    formData.append('app_id', data?.Appointment_Id);
    formData.append('reason', cancelNote);
    axios
      .delete(API_URL.addAppoinments, {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setLoading(false);

        if (res?.data?.status == 200) {
          Alert.alert('Success', res?.data?.message, [
            {
              text: 'Ok',
              onPress: () => refetch(),
            },
          ]);
        } else {
          Alert.alert('Warning', res?.data?.message || 'Somthing went wrong', [
            {
              text: 'Ok',
            },
          ]);
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Error', err?.response?.data?.message);
      });
  };

  const [isCancelNote, setIsCancelNote] = useState(false);
  const [cancelNote, setCancelNote] = useState('');

  const handleCancelAppoinments = () => {
    Alert.alert(
      'Warning',
      'Are you sure, you want to cancel this Appointment ?',
      [
        {text: 'Cancel', onPress: () => {}},
        {
          text: 'Confirm',
          onPress: () => setIsCancelNote(true),
        },
      ],
    );
  };

  return (
    <>
      {isLoading ? (
        <CustomLoaderRound />
      ) : (
        <Surface style={[styles.appoinmentContainer]}>
          <View
            style={{
              backgroundColor:
                data?.Appointment_Status === 'Cancelled'
                  ? colorList?.red
                  : colorList.primary,
              position: 'absolute',
              padding: 8,
              borderRadius: 8,
              top: -15,
              left: 10,
            }}>
            <Text
              variant="labelSmall"
              style={{color: colorList.white, fontSize: 10}}>
              {data?.Appointment_Status}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => handleCancelAppoinments()}
              style={{
                backgroundColor: colorList.red,
                position: 'absolute',
                padding: 8,
                borderRadius: 8,
                top: -35,
                right: 0,
              }}>
              <Text style={{color: colorList?.white}}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 10, padding: 10}}>
            <View style={styles.appoinmentNameSocial}>
              <TouchableOpacity
                style={[styles.appoinmentNameContainer]}
                onPress={navigate}>
                <Text style={styles.appoinmentNameLabel}>Patient Name</Text>
                <Text style={styles.appoinmentNameText}>
                  {data?.Patient_Name}
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.appoinmentNameSocialContainer,
                  Platform.OS == 'ios' && {justifyContent: 'space-around'},
                ]}>
                <TouchableOpacity onPress={openDialer}>
                  <Image
                    source={CallFillIcon}
                    style={{width: 20, height: 20, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={openWhatsApp}>
                  <Image
                    source={WhatsAppIcon}
                    style={{width: 25, height: 25, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>

                {Platform.OS !== 'ios' && (
                  <TouchableOpacity onPress={() => handlZoomLinkApi(data)}>
                    <Image
                      source={ZoomMeetingIcon}
                      style={{width: 25, height: 25, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.appoinmentDateTimeContainer}
              activeOpacity={0.9}
              onPress={navigate}>
              <View style={styles.appoinmentCalanderContainer}>
                <Image source={CalanderIcon} />
                <Text style={styles.appoinmentDate}>
                  {data?.Appointment_Date}
                </Text>
                {/* <Image source={EditIcon} /> */}
              </View>

              <View style={styles.appoinmentTimeContainer}>
                <Image source={TimerIcon} />
                <Text style={styles.appoinmentTime}>
                  {data?.Appointment_Time}
                </Text>
                {/* <Text style={styles.appoinmentTime}>{data?.timeTo}</Text> */}
              </View>
            </TouchableOpacity>

            <View style={styles.appoinmentHrizontalLine} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
              }}>
              <TouchableOpacity
                onPress={navigate}
                style={[styles.appoinmentToContainer]}>
                <Image
                  source={ProfileAvatar}
                  style={{
                    width: 28,
                    height: 28,
                    resizeMode: 'contain',
                    borderRadius: 100,
                  }}
                />
                <View style={styles.appoinmentToLabelTextContainer}>
                  <Text style={styles.appoinmentToLabel}>Appointment for</Text>
                  <Text style={styles.appoinmentToText}>
                    {data?.Doctor_Name}
                  </Text>
                </View>
              </TouchableOpacity>

              {data?.Appointment_Status != 'Cancelled' &&
                data?.isFocused != '1' && (
                  <TouchableOpacity
                    onPress={() => setQueueModal(true)}
                    style={[styles.appoinmentToContainer, {}]}>
                    <View
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        borderWidth: 0.2,
                        borderColor: colorList.Grey3,
                      }}>
                      <Text
                        style={[
                          styles.appoinmentToText,
                          {fontWeight: '400', color: colorList.primary},
                        ]}>
                        Queue Status
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
            </View>

            {openQueueModal && (
              <CustomModal
                close={() => setQueueModal(false)}
                show={openQueueModal}>
                <View
                  style={{
                    width: Dimensions.get('screen').width * 0.5,
                  }}>
                  {queueStatusList?.map(list => (
                    <TouchableOpacity
                      onPress={() => handleChangeQueueStatus(list?.name)}
                      style={{
                        padding: 5,
                        paddingVertical: 10,
                        borderWidth: 0.2,
                        borderRadius: 8,
                        marginVertical: 5,
                        borderColor: colorList.Grey3,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          textTransform: 'capitalize',
                          color: colorList.Grey1,
                        }}>
                        {list?.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <View
                    style={{
                      borderBottomWidth: 1,
                      marginVertical: 15,
                      borderColor: colorList.Grey3,
                    }}
                  />
                  {isLoading ? (
                    <CustomLoaderRound />
                  ) : (
                    <Button
                      title="Cancel"
                      onPress={() => setQueueModal(false)}
                    />
                  )}
                </View>
              </CustomModal>
            )}
          </View>
          {data?.Appointment_Status != 'Cancelled' && (
            <View
              style={{
                backgroundColor: colorList.socondary,
                position: 'absolute',
                padding: 8,
                borderRadius: 8,
                bottom: -15,
                right: 10,
              }}>
              <Text style={{color: colorList.white, fontSize: 10}}>
                {data?.queue_status}
              </Text>
            </View>
          )}
          <Portal>
            <Modal
              visible={isCancelNote}
              onDismiss={() => setIsCancelNote(false)}>
              <View
                style={{
                  backgroundColor: colorList.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                  width: Dimensions.get('screen').width * 0.8,
                  borderRadius: 8,
                }}>
                <Text>Reason For Cancel</Text>
                <View style={{width: '80%'}}>
                  <TextInput
                    placeholder="Reason For Cancel"
                    mode="outlined"
                    onChangeText={text => setCancelNote(text)}
                  />
                  <Text style={{color: colorList.red}}>* Required</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 15,
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Button
                        mode="elevated"
                        buttonColor={colorList.socondary}
                        textColor={colorList.white}
                        onPress={() => setIsCancelNote(false)}>
                        Cancel
                      </Button>
                    </View>
                    <Button
                      mode="elevated"
                      buttonColor={colorList.red}
                      textColor={colorList.white}
                      style={{}}
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
      )}
    </>
  );
};
