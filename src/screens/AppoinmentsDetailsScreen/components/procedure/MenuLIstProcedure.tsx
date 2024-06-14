// import axios from 'axios';
import {useEffect, useState} from 'react';
import {API_URL} from '../../../../utils/constants';
import loadsh from 'lodash';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import {
  Alert,
  Dimensions,
  ScrollView,
  View,
} from 'react-native';
import moment from 'moment';
import {Button, Divider, Surface, Text} from 'react-native-paper';
import Icons from "react-native-vector-icons/MaterialIcons";


import {CustomAddButton} from '../../../../components/CustomAddButton';
import {NoDataAvailable} from '../../../../components/NoDataAvailable';
import {CustomModal} from '../../../../components/CustomModal';
import {styles} from '../../appoinmentDetails.styles';
import {colorList} from '../../../../styles/global.styles';
import {AddProcedure} from './AddProcedure';
import {ShareModal} from '../ShareModal';
import {axiosInstance} from '../../../../config/axios.config.custom';

export const MenuListDetailsProcedure = ({patientDetails}: any) => {
  const axios = axiosInstance;
  const [isPopup, setIspoup] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [procedureList, setProcedureList] = useState({
    processed: null,
    original: null,
  });
  const [procedureEditdata, setProcedureEditdata] = useState(null);
  const [openedShareListId, setOpenedShareListId] = useState(null);
  const handleOpenShareModal = (listId: any) => setOpenedShareListId(listId);
  const handleCloseShareModal = () => setOpenedShareListId(null);

  useEffect(() => {
    getProcedureListApi();
    setTimeout(() => {
      setRefetch(false);
    }, 100);
  }, [refetch]);

  const getProcedureListApi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL.treatmentList}?patient_id=${patientDetails?.id}`,
      );
      setLoading(false);

      if (loadsh.isEqual(res?.data?.data, [[]])) {
        setProcedureList({
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

        setProcedureList({processed: dateWiseData, original: result});
      }
    } catch (error) {
      setLoading(false);
      console.error('Err in getTreatments Details....', error);
      setProcedureList({
        processed: null,
        original: null,
      });
    }
  };

  const handleUpdateProcedureApi = async (details: any) => {
    console.log(':GOING To DElete One only', details);
    setLoading(true);
    const payload = {
      patient_id: patientDetails?.id,
      date: moment().format('YYYY-MM-DD'),
      items: {},
    };

    payload.unique_id = details?.unique_id;
    const newArrOfArr = {};
    details?.data?.map((items: any, index: number) => {
      const newItem = {};

      Object.entries(items)?.map(([k, v]) => {
        if (k === 'cost') {
          newItem['price'] = v;
        } else if (k !== 'date_time' && k !== 'procedure_name') {
          newItem[k] = v;
        }
      });
      newArrOfArr[index] = newItem;
    });

    console.log('Final list off Arrr', newArrOfArr);

    payload.items = newArrOfArr;

    console.log('Payloads ==== >', payload);

    try {
      const res = await axios.post(API_URL.addTreatments, payload);
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

  const handleDeleteAllProcedureApi = async (id: any) => {
    try {
      setLoading(true);
      const payload = {
        unique_id: id,
      };

      axios
        .delete(API_URL.addTreatments, {
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

  const handleDeleteProcedure = (list: any) => {
    const temp = {...procedureList?.original};
    const indexes = temp[list?.unique_id].findIndex(
      fi =>
        fi.procedure_name === list?.procedure_name && fi.cost === list?.cost,
    );
    const result = temp[list?.unique_id][indexes];
    temp[list?.unique_id].splice(indexes, 1);
    Alert.alert(
      'Warning',
      'Are you sure, you want to delete this Procedure ?',
      [
        {text: 'Cancel', onPress: () => {}},
        {
          text: 'Confirm',
          onPress: () =>
            temp[list?.unique_id]?.length
              ? handleUpdateProcedureApi({
                  unique_id: list?.unique_id,
                  data: temp[list?.unique_id],
                })
              : handleDeleteAllProcedureApi(list?.unique_id),
        },
      ],
    );
  };

  const handleEditProcedure = (list: any) => {
    const indexes = procedureList?.original[list?.unique_id].findIndex(
      fi =>
        fi.procedure_name === list?.procedure_name && fi.cost === list?.cost,
    );
    setIspoup(true);

    if (indexes !== -1) {
      setProcedureEditdata({
        original: procedureList?.original[list?.unique_id],
        indexes: indexes,
        unique_id: list?.unique_id,
      });
    }
  };

  const handlePrintProcedure = (obj: any) => {
    console.log('Printttttt ====> Url', obj?.unique_id);
    console.log('Printttttt ====> Url Origninal ', procedureList);

    // Linking.openURL(procedureList?.original?.print[url?.unique_id]?.url)
    //   .then(res => console.log('Success', res))
    //   .catch(err => {
    //     console.error('Errorrr ===> ', err);
    //     Alert.alert('Warning', 'Somthing went wrong');
    //   });
  };

  if (isLoading) {
    return <CustomLoaderRound />;
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colorList.white,
          borderRadius: 10,
        }}>
        <ScrollView
          style={{maxHeight: Dimensions.get('screen').height * 0.55}}
          showsVerticalScrollIndicator={false}>
          {procedureList?.processed ? (
            Object.entries(procedureList?.processed)?.map(
              ([key, value], ids) => {
                const capitalizeFirstLetter = (string: any) =>
                  string.charAt(0).toUpperCase() + string.slice(1) + ' ';

                return (
                  <View
                    style={{
                      backgroundColor: colorList.white,
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 10,
                    }}>
                    <View style={{padding: 5}}>
                      <Text
                        variant="titleMedium"
                        style={{color: colorList.dark}}>
                        {moment(key).format('DD-MM-YYYY')}
                      </Text>
                    </View>
                    <Divider style={{marginBottom: 15}} />

                    {value?.map((list, ids1) => {
                      const ids22 = 0;

                      return (
                        <Surface
                          style={{
                            backgroundColor: colorList.white,
                            borderRadius: 8,
                            marginBottom: 15,
                          }}>
                          {Object.entries(list).map(([k, v], ids2) => {
                            if (
                              k !== 'unique_id' &&
                              v !== '' &&
                              k != 'procedure_id' &&
                              k !== 'discount_type'
                            )
                              return (
                                <View
                                  style={{borderRadius: 100}}
                                  key={`${ids}${ids2}`}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      padding: 10,
                                    }}>
                                    <View style={{flex: 1, height: 15}}>
                                      <Text variant="labelMedium">
                                        {k
                                          ?.split('_')
                                          .map(part =>
                                            capitalizeFirstLetter(part),
                                          )}
                                      </Text>
                                    </View>
                                    {k === 'date_time' ? (
                                      <View style={{flex: 1, height: 15}}>
                                        <Text variant="labelMedium">
                                          {moment(v).format('DD-MM-YYYY')}
                                        </Text>
                                      </View>
                                    ) : k === 'discount' ? (
                                      <View style={{flex: 1, height: 15}}>
                                        <Text variant="labelMedium">
                                          {v} {list['discount_type']}
                                        </Text>
                                      </View>
                                    ) : (
                                      <View style={{flex: 1, height: 15}}>
                                        <Text variant="labelMedium">{v}</Text>
                                      </View>
                                    )}
                                  </View>
                                  <Divider />
                                </View>
                              );
                          })}

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              margin: 10,
                            }}>
                            <Button
                              mode="elevated"
                              onPress={() => handleEditProcedure(list)}
                              style={{
                                backgroundColor: colorList.primary,
                              }}
                              labelStyle={{color: colorList.white}}>
                                                            <Icons name='edit' size={20} color={colorList.white} />

                            </Button>

                            <Button
                              mode="elevated"
                              onPress={() => handleDeleteProcedure(list)}
                              style={{backgroundColor: colorList.red}}
                              labelStyle={{color: colorList.white}}>
                                                                                        <Icons name='delete' size={20} color={colorList.white} />

                            </Button>

                            <ShareModal
                              open={
                                openedShareListId === `${ids}${ids1}${ids22}`
                              }
                              openMenu={() =>
                                handleOpenShareModal(`${ids}${ids1}${ids22}`)
                              }
                              closeMenu={handleCloseShareModal}
                              data={{
                                ...list,
                                ...patientDetails,
                                ...{
                                  print_url:
                                    procedureList?.original?.print[
                                      list?.unique_id
                                    ]?.url,
                                },
                              }}
                              email
                              whatsapp
                              prints
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

        <View style={{height: 70, position: 'absolute', bottom: 2, right: 2}}>
          <View style={styles.MenuListDetailsChiefComplaintsAddBtnContainer}>
            <CustomAddButton
              onClick={() => {
                setIspoup(true);
                setProcedureEditdata(null);
              }}
            />
          </View>
        </View>
        <CustomModal
          show={isPopup}
          close={() => setIspoup(false)}
          title={procedureEditdata ? 'Edit Procedure' : 'Add Procedure'}>
          <AddProcedure
            close={() => setIspoup(false)}
            patientDetails={patientDetails}
            refetch={() => setRefetch(true)}
            editData={procedureEditdata}
          />
        </CustomModal>
      </View>
    );
  }
};
