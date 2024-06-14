import React, {useEffect, useState} from 'react';
import {colorList} from '../../../../styles/global.styles';
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {axiosInstance as axios} from 'config/axios.config.custom';
import {API_URL} from 'utils/constants';

import moment from 'moment';
import {ClinicalNoteList} from './Components/ClinicalNoteList';

export const AddComplaintPopups = ({
  close,
  refetch,
  patientDetails,
  editData,
}) => {
  console.log('editData ===> ', editData?.data);

  const [isLoading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({
    complaints: [],
    history: [],
    observation: [],
    investigation: [],
    diagnosis: [],
    note: [],
  });

  useEffect(() => {
    if (editData) {
      console.log('editData?.complaints ====>', editData?.data);

      setSelectedData({
        complaints: editData?.data?.complaint || [],
        history: editData?.data?.history || [],
        observation: editData?.data?.observation || [],
        investigation: editData?.data?.investigation || [],
        diagnosis: editData?.data?.diagnose || [],
        note: editData?.data?.note || [],
      });
    }
  }, []);

  console.log('selectedData ===> ', selectedData);

  const handleSetSelected = (type, data) => {
    setSelectedData(prev => ({...prev, [type]: data}));
  };

  console.log('Selected Dataa ====> ', selectedData);

  const arrayObjectToString = (list: any) => {
    const result = list.map(item => item.notes);
    return result;
  };

  const handleSubmit = () => {
    setLoading(true);
    const {complaints, history, observation, investigation, diagnosis, note} =
      selectedData;

    const payload = {
      complaints: arrayObjectToString(complaints),
      history: arrayObjectToString(history),
      observation: arrayObjectToString(observation),
      investigation: arrayObjectToString(investigation),
      diagnosis: arrayObjectToString(diagnosis),
      note: arrayObjectToString(note),
      date_time: moment().format('YYYY-MM-DD'),
      patient_id: patientDetails?.id,
    };

    if (editData) {
      payload.unique_id = editData?.id;
    }

    console.log(' --- > payload ---> ', payload);

    axios
      .post(`${API_URL.clinicNotes}`, payload)
      .then(({data}) => {
        console.log('REs Clinical Note Add ===> ', data);
        setLoading(false);

        if (data?.status == 200) {
          Alert.alert('Success', data?.message, [
            {
              text: 'Ok',
              onPress: () => {
                close();
                refetch();
              },
            },
          ]);
        } else {
          Alert.alert('Warning', data?.message || 'Somrthing Went Wrong', [
            {
              text: 'Ok',
              onPress: () => {
                close();
                refetch();
              },
            },
          ]);
        }
      })
      .catch(err => {
        console.log(
          'Add Clinincal Note Addd Errrrr',
          err.response?.data?.message,
        );
        setLoading(false);
        Alert.alert('Error', err.response?.data?.message);
      });
  };

  return (
    <View
      style={{
        height: Dimensions.get('screen').height * 0.65,
        width: Dimensions.get('screen').width * 0.85,
      }}>
      <>
        <View
          style={{
            flex: 0.1,
            position: 'relative',
          }}>
          <TouchableOpacity
            onPress={close}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}>
            <Icons name="close" size={25} color={'#000'} />
          </TouchableOpacity>
        </View>

        <ClinicalNoteList
          selectedData={selectedData}
          handleSetSelected={handleSetSelected}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Button
            mode="elevated"
            buttonColor={colorList.red}
            labelStyle={{color: colorList.white}}
            onPress={close}>
            Cancel
          </Button>
          <Button
            onPress={handleSubmit}
            mode="elevated"
            buttonColor={colorList.primary}
            labelStyle={{color: colorList.white}}
            loading={isLoading}
            disabled={isLoading}>
            Submit
          </Button>
        </View>
      </>
    </View>
  );
};
