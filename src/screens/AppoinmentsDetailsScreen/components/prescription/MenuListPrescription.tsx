import React from 'react';
import {useEffect, useState} from 'react';
import {API_URL} from '../../../../utils/constants';
import loadsh from 'lodash';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import {Alert, Dimensions, ScrollView, View} from 'react-native';
import {Button, Divider, Surface, Text} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';

import {CustomAddButton} from '../../../../components/CustomAddButton';
import {CustomModal} from '../../../../components/CustomModal';
import {styles} from '../../appoinmentDetails.styles';
import {colorList} from '../../../../styles/global.styles';
import {AddPrescriptionPopups} from './AddPrescription';
import {NoDataAvailable} from '../../../../components/NoDataAvailable';
import ProcedureDetailsList from './ProcedureDetailsList';
import moment from 'moment';
import {ShareModal} from '../ShareModal';
import {axiosInstance as axios} from '../../../../config/axios.config.custom';

export const MenuListPrescription = ({patientDetails}: any) => {
  const [isPopup, setIspoup] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [prescriptionList, setPrescriptionList] = useState({
    processed: null,
    original: null,
  });

  const [prescriptionEditData, setPrescriptionEditData] = useState(null);
  const [openedShareListId, setOpenedShareListId] = useState(null);
  const handleOpenShareModal = (listId: any) => setOpenedShareListId(listId);
  const handleCloseShareModal = () => setOpenedShareListId(null);
  const [medicineUnitList, setMedicineUnitList] = useState([]);

  useEffect(() => {
    getPrescriptionListApi();
    getMedicineListApi();
    setTimeout(() => {
      setRefetch(false);
    }, 100);
  }, [refetch]);

  const getPrescriptionListApi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL.prescriptionlist}?patient_id=${patientDetails?.id}`,
      );
      setLoading(false);

      if (loadsh.isEqual(res?.data?.data, [[]])) {
        setPrescriptionList({
          processed: null,
          original: null,
        });
      } else {
        const result = res?.data?.data;
        const dateWiseData = {};

        for (const [uniqueId, items] of Object.entries(result)) {
          if (uniqueId !== 'print')
            items.forEach(item => {
              const {date_time: dateTime, ...rest} = item;
              if (!dateWiseData[dateTime]) {
                dateWiseData[dateTime] = [];
              }
              dateWiseData[dateTime].push({unique_id: uniqueId, ...rest});
            });
        }
        setPrescriptionList({processed: dateWiseData, original: result});
      }
    } catch (error) {
      setLoading(false);
      console.error('Err in getTreatments Details....', error);
      setPrescriptionList({
        processed: null,
        original: null,
      });
    }
  };

  const handleUpdatePrescriptionApi = async (details: any) => {
    console.log(':GOING To DElete Multi Files ', details);
    setLoading(true);
    const payload = {
      patient_id: patientDetails?.id,
      date: moment().format('YYYY-MM-DD'),
      review_date: moment().format('YYYY-MM-DD'),
      items: {},
    };

    payload.unique_id = details?.unique_id;
    const newArrOfArr = {};

    details?.data?.map((items: any, index: number) => {
      const obj = {
        medicine_id: items?.medicine_id,
        strength: items?.strength,
        unit: items?.unit,
        duration: items?.duration,
        duration_type: items?.duration_type,
        morning: items?.morning,
        noon: items?.noon,
        night: items?.night,
        food: items?.food,
        notes: items?.notes || '',
        musage: items?.usage || '',
        internalnote: items?.internalnote || '',
      };
      newArrOfArr[`${index}`] = obj;
    });

    payload.items = newArrOfArr;

    try {
      const res = await axios.post(API_URL.addPrescription, payload);
      if (res && res.status === 200) {
        setLoading(false);
        console.log('Resss', res.data);
        setTimeout(() => {
          Alert.alert('Success', res?.data?.message || 'Added Successfully', [
            {
              text: 'OK',
              onPress: () => {
                setRefetch(true);
              },
            },
          ]);
        }, 10);
      } else {
        setLoading(false);
        Alert.alert(
          res.data?.message || 'Somthing went wrong,please try agin later',
        );
      }
    } catch (err) {
      setLoading(false);
      console.error('Errr in post patient details', err.response.data);
      Alert.alert('Error', err?.response?.data?.message);
    }
  };

  const handleDeleteAllPrescriptionApi = (id: any) => {
    try {
      setLoading(true);
      const payload = {
        unique_id: id,
      };

      axios
        .delete(API_URL.addPrescription, {
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res.status === 200) {
            setLoading(false);
            Alert.alert('Success', res?.data?.message || 'Added Successfully', [
              {text: 'Ok', onPress: () => setRefetch(true)},
            ]);
          } else {
            setLoading(false);
            Alert.alert(
              'warning',
              res.data?.message || 'Somthing went wrong,please try agin later',
              [{text: 'Ok', onPress: () => setRefetch(true)}],
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

  const handleDeletePriscription = (list: any) => {
    const temp = {...prescriptionList?.original};
    console.log('temp =====> ', temp);
    if (Object.keys(temp.print)) {
      console.log('Object.keys(temp.print)', Object.keys(temp.print));
      delete temp.print;
    }

    const indexes = temp[list?.unique_id].findIndex(
      fi =>
        fi.medicine_id === list?.medicine_id &&
        fi.strength === list?.strength &&
        fi.unit == list?.unit,
    );
    temp[list?.unique_id].splice(indexes, 1);

    Alert.alert(
      'Warning',
      'Are you sure, you want to delete this Prescription ?',
      [
        {text: 'Cancel', onPress: () => {}},
        {
          text: 'Confirm',
          onPress: () =>
            temp[list?.unique_id]?.length
              ? handleUpdatePrescriptionApi({
                  unique_id: list?.unique_id,
                  data: temp[list?.unique_id],
                })
              : handleDeleteAllPrescriptionApi(list?.unique_id),
        },
      ],
    );
  };

  const getMedicineListApi = (params = '') => {
    setLoading(true);
    const Url =
      params !== ''
        ? `${API_URL.medicineMaster}?searchterm=${params}`
        : `${API_URL.medicineMaster}`;
    axios
      .get(Url)
      .then(res => {
        setLoading(false);
        Object.entries(res.data?.data).map(([k, v]) => {
          if (Array.isArray(v)) {
            if (k === 'medicine_unit') {
              setMedicineUnitList(v);
            }
          }
        });
      })
      .catch(err => {
        setLoading(false);
        console.error('getMedicineListApi Error', err);
      });
  };

  const getUnitDetails = (id: string) => {
    return medicineUnitList?.find(fi => fi.id === id);
  };

  const order1 = ['medicine_name', 'strength', 'duration'];
  const order2 = ['usage', 'food', 'notes', 'general', 'note'];

  const handleEditPriscription = async (list: any) => {
    const indexes = prescriptionList?.original[list?.unique_id].findIndex(
      fi =>
        fi.medicine_id === list?.medicine_id && fi.duration === list?.duration,
    );
    if (indexes !== -1) {
      setPrescriptionEditData({
        original: prescriptionList?.original[list?.unique_id],
        indexes: indexes,
        unique_id: list?.unique_id,
      });
      setIspoup(true);
    }
  };

  if (isLoading) {
    return <CustomLoaderRound />;
  } else {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={{maxHeight: Dimensions.get('screen').height * 0.65}}
          showsVerticalScrollIndicator={false}>
          {prescriptionList?.processed ? (
            Object.entries(prescriptionList?.processed)?.map(
              ([key, val], ids) => {
                return (
                  <View
                    key={ids}
                    style={{
                      backgroundColor: colorList.white,
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 10,
                    }}>
                    <View style={{marginVertical: 10}}>
                      <Text
                        variant="titleMedium"
                        style={{color: colorList.dark}}>
                        {moment(key).format('DD-MM-YYYY')}
                      </Text>
                      <Divider style={{marginVertical: 10}} />
                    </View>

                    {val?.map((list, ids2) => {
                      // console.log('list ===> ', list);

                      return (
                        <Surface
                          key={ids2}
                          style={{
                            padding: 10,
                            borderRadius: 8,
                            margin: 5,
                            marginBottom: 15,
                            backgroundColor: colorList.white,
                          }}>
                          {order1?.map(k => {
                            const v = list[k];

                            if (
                              k !== 'print' &&
                              k !== 'unique_id' &&
                              v !== '' &&
                              v != null &&
                              v != 0
                            )
                              return (
                                <>
                                  <ProcedureDetailsList
                                    keys={k}
                                    val={v}
                                    durationType={list['duration_type']}
                                    strengthUnit={
                                      getUnitDetails(list['unit'])
                                        ?.medicine_unit || ''
                                    }
                                  />
                                  <Divider style={{marginVertical: 5}} />
                                </>
                              );
                          })}

                          <View
                            style={{flex: 1, flexDirection: 'row', padding: 5}}>
                            <Text variant="labelMedium" style={{flex: 1}}>
                              Frequency
                            </Text>
                            <Text
                              variant="labelMedium"
                              style={{
                                flex: 1,
                              }}>{`${list['morning']} - ${list['noon']} - ${list['night']} `}</Text>
                          </View>
                          <Divider style={{marginVertical: 5}} />

                          {order2?.map(k => {
                            const v = list[k];

                            if (
                              k !== 'print' &&
                              k !== 'unique_id' &&
                              v !== '' &&
                              v != null &&
                              v != 0
                            )
                              return (
                                <>
                                  <ProcedureDetailsList keys={k} val={v} />
                                  <Divider style={{marginVertical: 5}} />
                                </>
                              );
                          })}
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Button
                              mode="elevated"
                              onPress={() => handleEditPriscription(list)}
                              style={{
                                backgroundColor: colorList.primary,
                              }}
                              labelStyle={{color: colorList.white}}>
                              <Icons
                                name="edit"
                                size={20}
                                color={colorList.white}
                              />
                            </Button>
                            <Button
                              mode="elevated"
                              onPress={() => handleDeletePriscription(list)}
                              style={{
                                backgroundColor: colorList.red,
                              }}
                              labelStyle={{color: colorList.white}}>
                              <Icons
                                name="delete"
                                size={20}
                                color={colorList.white}
                              />
                            </Button>
                            <ShareModal
                              open={openedShareListId === `${ids}${ids2}`}
                              openMenu={() =>
                                handleOpenShareModal(`${ids}${ids2}`)
                              }
                              closeMenu={handleCloseShareModal}
                              data={{
                                ...list,
                                ...patientDetails,
                                ...{
                                  print_url:
                                    prescriptionList?.original?.print[
                                      list?.unique_id
                                    ]?.url,
                                },
                              }}
                              email
                              whatsapp
                              prints
                              message
                              mailTitle="Prescription Details"
                              mailContent="Prescription Details"
                            />
                          </View>
                        </Surface>
                      );
                    })}
                  </View>
                );
              },
            )
          ) : (
            <NoDataAvailable />
          )}
        </ScrollView>
        <View style={{height: 70, position: 'absolute', bottom: 5, right: 0}}>
          <View style={styles.MenuListDetailsChiefComplaintsAddBtnContainer}>
            <CustomAddButton
              onClick={() => {
                setIspoup(true);
                setPrescriptionEditData(null);
              }}
            />
          </View>
        </View>
        <CustomModal
          show={isPopup}
          close={() => setIspoup(false)}
          title={prescriptionEditData ? 'Edit Prescription' : ''}>
          <AddPrescriptionPopups
            close={() => setIspoup(false)}
            patientDetails={patientDetails}
            refetch={() => setRefetch(true)}
            editData={prescriptionEditData}
          />
        </CustomModal>
      </View>
    );
  }
};
