// import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {API_URL} from '../../../../utils/constants';
import {useMutation, useQuery} from '@tanstack/react-query';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Surface, Text} from 'react-native-paper';
import {SampleImage} from '../../../../assets';
import {NoDataAvailable} from '../../../../components/NoDataAvailable';
import {CustomAddButton} from '../../../../components/CustomAddButton';
import {CustomModal} from '../../../../components/CustomModal';
import {ToasterTypes, colorList} from '../../../../styles/global.styles';
import {CustomButtons} from '../../../../components/CustomButtons';
import loadash, {isArray} from 'lodash';
import {Dropdown} from 'react-native-element-dropdown';
import {useToast} from 'react-native-toast-notifications';
import moment from 'moment';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {AddComplaintPopups} from './AddClinicalNotes';
import {axiosInstance as axios} from '../../../../config/axios.config.custom';
import {AddComplaintsDropdown} from './Components/AddComplaintsDropdowns';
import CustomMultiselect from 'components/CustomMultiselect';
import {clinicalNotesMaster} from 'screens/AppoinmentsDetailsScreen/services/getClinicalNotesMaster';
import Icons from 'react-native-vector-icons/MaterialIcons';

const ClinicalNoteList = [
  'complaint',
  'history',
  'observation',
  'investigation',
  'diagnose',
  'note',
];

export const MenuListDetailsChiefComplaints = ({patientDetails}: any) => {
  const [isPopup, setIspoup] = useState(false);
  const [printList, setPrints] = useState(null);
  const [clinicalNotesList, setClinicalNotes] = useState([]);
  const [chiefComplaintEditdata, setChiefComplaintEditData] = useState(null);
  const [isLoadings, setLoading] = useState(false);

  const getClinicNotesDetails = async () => {
    try {
      const res = await axios.get(
        `${API_URL.clinicNoteList}?patient_id=${patientDetails?.id}`,
      );
      return res;
    } catch (error) {
      console.error('Err in getAppoinment Details....', error);
      throw error;
    }
  };

  const {isLoading, isFetching, refetch} = useQuery({
    queryKey: ['getClinicNotesDetails'],
    queryFn: getClinicNotesDetails,
    onSuccess({data}) {
      if (loadash.isEqual(data.data, [[]])) {
        setClinicalNotes([]);
      } else {
        // setCheifComplaintEditdata(data.data);
        setPrints(data?.data?.print);
        const dataArray = Object.entries(data?.data).flatMap(([key, value]) => {
          if (key !== 'print') return value.map(item => ({...item, key}));
        });

        dataArray.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));

        // const groupedData = dataArray.reduce((acc, curr) => {
        //   if (curr) {
        //     const {date_time, key, type} = curr;
        //     const groupKey = `${date_time}`;

        //     if (!acc[groupKey]) {
        //       acc[groupKey] = {};
        //     }
        //     if (!acc[groupKey][type]) {
        //       acc[groupKey][type] = [];
        //     }
        //     acc[groupKey][type].push(curr);
        //   }
        //   return acc;
        // }, {});

        const groupedData = dataArray.reduce((acc, curr) => {
          if (curr) {
            curr.notes = curr.clinic_note;
            const {date_time, key, type} = curr;
            const groupKey = `${date_time}`;

            if (!acc[groupKey]) {
              acc[groupKey] = {};
            }
            if (!acc[groupKey][key]) {
              acc[groupKey][key] = {};
            }
            if (!acc[groupKey][key][type]) {
              acc[groupKey][key][type] = [];
            }
            acc[groupKey][key][type].push(curr);
          }
          return acc;
        }, {});

        setClinicalNotes(groupedData);
      }
    },
  });

  const handleDeleteChiefComplaintApi = async (id: string) => {
    try {
      setLoading(true);
      const payload = {
        unique_id: id,
      };
      axios
        .delete(`${API_URL.clinicNotes}`, {
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res.status === 200) {
            setLoading(false);
            Alert.alert(
              'Success',
              res?.data?.message || 'Delete Successfully',
              [{text: 'Ok', onPress: () => refetch()}],
            );
          } else {
            setLoading(false);
            Alert.alert(
              res.data?.message || 'Somthing went wrong,please try agin later',
            );
          }
        })
        .catch(err => {
          setLoading(false);

          Alert.alert(
            'Error',
            err?.response?.data?.message || 'Error, Please try again later',
          );
        });
    } catch (err) {
      setLoading(false);
      console.error('Errrrrr in Chief Complains', err?.response?.data);
    }
  };

  const handleEditChiefComplaint = (id: string, data: any) => {
    setChiefComplaintEditData({id, data});
    setIspoup(true);
  };

  const handleDeleteChiefComplaint = (id: string) => {
    Alert.alert('Warning', 'Are you sure, you want to delete this note ?', [
      {text: 'Cancel', onPress: () => {}},
      {
        text: 'Confirm',
        onPress: () => handleDeleteChiefComplaintApi(id),
      },
    ]);
  };

  const handlePrint = id => {
    if (printList[id]?.url) {
      Linking.openURL(printList[id]?.url).catch(err => {
        Alert.alert('Error', err.response.data.message);
        console.error('An error occurred', err);
      });
    } else Alert.alert('Warning', 'No Print Url Found please try again later');
  };

  if (isLoading || isLoadings || isFetching) {
    return <CustomLoaderRound />;
  } else {
    return (
      <View
        style={{
          flex: 0.98,
          position: 'relative',
          backgroundColor: colorList.white,
          borderRadius: 10,
        }}>
        <ScrollView
          style={{
            maxHeight: Dimensions.get('screen').height * 0.65,
          }}
          showsVerticalScrollIndicator={false}>
          {Object.entries(clinicalNotesList)?.length ? (
            Object.entries(clinicalNotesList).map(([k, v], index: number) => {
              return (
                <View
                  key={index}
                  style={{
                    padding: 5,
                    marginBottom: 15,
                    borderRadius: 8,
                    backgroundColor: '#fff',
                  }}>
                  <View
                    style={{
                      borderBottomWidth: 0.2,
                      paddingBottom: 8,
                      borderColor: colorList?.Grey3,
                      margin: 5,
                    }}>
                    <Text style={{fontSize: 17}}>
                      {moment(k).format('DD-MM-YYYY')}
                    </Text>
                  </View>

                  <ScrollView
                    style={{
                      borderRadius: 8,
                      padding: 0,
                    }}>
                    <View
                      style={{
                        backgroundColor: colorList.white,
                      }}>
                      {Object.entries(v).map(([k1, v1], index3) => {
                        return (
                          <Surface
                            key={index3}
                            style={{
                              padding: 10,
                              backgroundColor: colorList.white,
                              margin: 10,
                              borderRadius: 10,
                            }}>
                            {Object.entries(v1).map(([k2, v2], index4) => {
                              return (
                                <View
                                  key={index4}
                                  style={{
                                    flexDirection: 'row',
                                    marginVertical: 6,
                                  }}>
                                  <View
                                    style={{
                                      flex: 1,
                                      justifyContent: 'center',
                                    }}>
                                    <Text
                                      variant="titleSmall"
                                      style={styles.label}>
                                      {k2 === 'complaint'
                                        ? 'Chief Complaints'
                                        : k2 === 'diagnose'
                                          ? 'Diagnosis'
                                          : k2 === 'note'
                                            ? 'notes'
                                            : k2}
                                    </Text>
                                  </View>
                                  <View>
                                    <Text> : </Text>
                                  </View>
                                  <View
                                    style={{
                                      flex: 1.9,
                                      justifyContent: 'center',
                                    }}>
                                    {v2?.map((v2List, index5) => (
                                      <View
                                        style={styles.labelValueWrapper}
                                        key={index5}>
                                        <Text
                                          variant="labelMedium"
                                          style={styles.values}>
                                          {v2List?.clinic_note}
                                        </Text>
                                        {index5 !== v2?.length - 1 && (
                                          <Text>,</Text>
                                        )}
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              );
                            })}
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 10,
                              }}>
                              <Button
                                mode="elevated"
                                onPress={() => handleEditChiefComplaint(k1, v1)}
                                style={{
                                  backgroundColor: colorList.primary,
                                }}
                                labelStyle={{
                                  color: colorList.white,
                                }}>
                                <Icons
                                  name="edit"
                                  size={20}
                                  color={colorList.white}
                                />
                              </Button>
                              <Button
                                mode="elevated"
                                onPress={() => handleDeleteChiefComplaint(k1)}
                                style={{
                                  backgroundColor: colorList.red,
                                }}
                                labelStyle={{
                                  color: colorList.white,
                                }}>
                                <Icons
                                  name="delete"
                                  size={20}
                                  color={colorList.white}
                                />
                              </Button>
                              <Button
                                mode="elevated"
                                onPress={() => handlePrint(k1)}
                                style={{
                                  backgroundColor: colorList.red,
                                }}
                                labelStyle={{
                                  color: colorList.white,
                                }}>
                                <Icons
                                  name="print"
                                  size={20}
                                  color={colorList.white}
                                />
                              </Button>
                            </View>
                          </Surface>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              );
            })
          ) : (
            <NoDataAvailable />
          )}
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 5,
          }}>
          <CustomAddButton
            onClick={() => {
              setChiefComplaintEditData(null);
              setIspoup(true);
            }}
          />
        </View>
        <CustomModal show={isPopup} close={() => setIspoup(false)}>
          <AddComplaintPopups
            close={() => setIspoup(false)}
            patientDetails={patientDetails}
            refetch={refetch}
            editData={chiefComplaintEditdata}
          />
        </CustomModal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  labelValueWrapper: {
    flexDirection: 'row',
  },
  label: {
    textTransform: 'capitalize',
  },
  values: {
    textTransform: 'capitalize',
  },
});
