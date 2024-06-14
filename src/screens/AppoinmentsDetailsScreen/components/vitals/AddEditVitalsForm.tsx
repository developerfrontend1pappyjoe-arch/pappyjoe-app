import moment from 'moment';
import {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  ScrollView,

  // TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';

import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import {colorList} from '../../../../styles/global.styles';
import {vitalsStyles} from './vitals.styles';
// import axios from 'axios';
import {API_URL} from '../../../../utils/constants';
import {FormStyles} from '../../../../styles/form.styles';
import {
  BpTypesOption,
  CovidTestOptions,
  VaccineStatusOption,
} from '../../../../utils/constantOptions';
import {AddEditVitalsFormProps} from '../../../../types/AppoinmentDetails/AddEditLisVitalst';
import {TextInput, SegmentedButtons, Surface, Text} from 'react-native-paper';
import {axiosInstance} from '../../../../config/axios.config.custom';

const FormFieldWrapper = ({children}: any) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 10}}>{children}</View>
  );
};

export const AddEditVitalsForm = ({
  close,
  patientDetails,
  refetch,
  editData,
}: AddEditVitalsFormProps) => {
  console.log('patientDetails', patientDetails?.Patient_Id);
  const axios = axiosInstance;

  useEffect(() => {
    getProcedureListApi();
  }, []);

  useEffect(() => {
    if (editData) {
      console.log('Edited Dataaaa ===> ', editData);
      Object.entries(editData).map(([key, val]) => {
        if (key === 'bp_type') {
          const indexBp = BpTypesOption.findIndex(fi => fi.name === val);
          formData[`${key}`] = BpTypesOption[indexBp];
        } else if (key === 'covtest') {
          const indexCt = CovidTestOptions.findIndex(fi => fi.name === val);

          console.log('indexCt ===> ', indexCt);

          formData[`${key}`] = CovidTestOptions[indexCt];
        } else if (
          key === 'added_date' ||
          key === 'covstartdate' ||
          key === 'covenddate' ||
          key === 'firstdose' ||
          key === 'seconddose' ||
          key === 'booster1' ||
          key === 'booster2'
        ) {
          if (moment(val, 'YYYY-MM-DD').isValid()) {
            formData[`${key}`] = new Date(val);
          } else {
            formData[`${key}`] = new Date();
          }
        } else if (val == '0') {
          formData[`${key}`] = '';
        } else formData[`${key}`] = val;
      });
    }
  }, [editData]);

  const [isloading, setLoader] = useState(false);
  const [procedureList, setProcedureList] = useState([]);
  const [startDateModal, setStartDateModal] = useState(false);
  const [endDateModal, setEndDateModal] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [dateModal, setDateModal] = useState({
    addedDate: false,
    covstartdate: false,
    covenddate: false,
    firstdose: false,
    seconddose: false,
    booster1: false,
    booster2: false,
  });

  const [formData, setFormData] = useState({
    patient_id: patientDetails?.id,
    pulse: '',
    temperature: '',
    systolic: '',
    diastolic: '',
    bp_type: BpTypesOption[0],
    weight: '',
    height: '',
    sugar: '',
    cholesterol: '',
    respiratory: '',
    spo: '',
    added_date: new Date(),
    covtest: CovidTestOptions[0],
    covstartdate: new Date(),
    covenddate: new Date(),
    remarks: '',
    vaccinestatus: 'Not Done',
    vaccinecompany: '',
    firstdose: new Date(),
    seconddose: new Date(),
    vaccinecompany1: '',
    vaccinecompany2: '',
    booster1: new Date(),
    booster2: new Date(),
    uniqueid: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    pulse: '',
    temperature: '',
    systolic: '',
    diastolic: '',
    bp_type: BpTypesOption[0],
    weight: '',
    height: '',
    sugar: '',
    cholesterol: '',
    respiratory: '',
    spo: '',
    added_date: moment().format('YYYY-MM-DD'),
    covtest: CovidTestOptions[2],
    covstartdate: new Date(),
    covenddate: new Date(),
    remarks: '',
    vaccinestatus: '',
    vaccinecompany: '',
    firstdose: new Date(),
    seconddose: new Date(),
    vaccinecompany1: '',
    vaccinecompany2: '',
    booster1: new Date(),
    booster2: new Date(),
    uniqueid: '',
  });

  const handleChange = (field: any, value: any) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value,
    }));
    setErrorMessages(prevErrorMessages => ({
      ...prevErrorMessages,
      [field]: '',
    }));
  };

  const getProcedureListApi = () => {
    axios
      .get(API_URL.getProcedureMaster)
      .then(res => {
        if (res?.data?.status === 200) {
          setProcedureList(res?.data?.data);
        } else {
          Alert.alert('Warning', res?.data?.message);
        }
      })
      .catch(err => {
        console.log('Errrrrrr', err.response.data);
        setProcedureList([]);
      });
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const addVitalsApi = async () => {
    setLoader(true);

    const formDetails = new FormData();
    Object.entries(formData).map(([key, val]) => {
      if (val !== '') {
        if (key === 'bp_type' || key === 'covtest') {
          formDetails.append(`${key}`, `${val?.name}`);
        } else if (
          key === 'covstartdate' ||
          key === 'covenddate' ||
          key === 'firstdose' ||
          key === 'seconddose' ||
          key === 'booster1' ||
          key === 'booster2'
        ) {
          if (!moment(val).startOf('day').isSame(moment().startOf('day'))) {
            formDetails.append(`${key}`, `${val?.name}`);
          }
        } else if (key === 'added_date') {
          formDetails.append(`${key}`, `${moment(val).format('YYYY-MM-DD')}`);
        } else formDetails.append(`${key}`, `${val}`);
      }

      if (editData) {
        formDetails.append('uniqueid', editData?.unique);
      }
    });

    console.log('Payloads --------> ', formDetails);

    try {
      if (editData) {
        const res = await axios.put(API_URL.vitals, formDetails, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res && res.status === 200) {
          setLoader(false);
          console.log('Resss', res.data);
          setTimeout(() => {
            Alert.alert('Success', res?.data?.message || 'Added Successfully', [
              {
                text: 'OK',
                onPress: () => {
                  close();
                  refetch();
                },
              },
            ]);
          }, 10);
        } else {
          setLoader(false);
          Alert.alert(
            res.data?.message || 'Somthing went wrong,please try agin later',
          );
        }
      } else {
        const res = await axios.post(API_URL.vitals, formDetails, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (res && res.status === 200) {
          setLoader(false);
          console.log('Resss', res.data);
          setTimeout(() => {
            Alert.alert('Success', res?.data?.message || 'Added Successfully', [
              {
                text: 'OK',
                onPress: () => {
                  close();
                  refetch();
                },
              },
            ]);
          }, 10);
        } else {
          setLoader(false);
          Alert.alert(
            res.data?.message || 'Somthing went wrong,please try agin later',
          );
        }
      }
    } catch (err) {
      setLoader(false);
      console.error('Errr in post patient details', err.response.data);
      Alert.alert('Error', err?.response?.data?.message);
    }
  };

  return (
    <View style={vitalsStyles.wrapper}>
      <ScrollView
        style={{flex: 1, padding: 1}}
        showsVerticalScrollIndicator={false}>
        <FormFieldWrapper>
          <View style={{marginRight: 10, flex: 1}}>
            <TextInput
              mode="outlined"
              value={moment(formData?.added_date).format('DD-MM-YYYY')}
              onPressIn={() =>
                setDateModal(prev => ({...prev, addedDate: true}))
              }
              label="Added Date"
              style={[FormStyles.input, {height: 50}]}
            />
          </View>
          <DatePicker
            modal
            mode="date"
            open={dateModal.addedDate}
            date={formData?.added_date}
            maximumDate={new Date()}
            onConfirm={date => {
              setDateModal(prev => ({...prev, addedDate: false}));
              handleChange('added_date', date);
            }}
            onCancel={() => setDateModal(prev => ({...prev, addedDate: false}))}
          />
        </FormFieldWrapper>
        <FormFieldWrapper>
          <View
            style={[vitalsStyles.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              label="Temperature (°F)"
              keyboardType="decimal-pad"
              value={formData.temperature.toString()}
              onChangeText={text => handleInputChange('temperature', text)}
              style={FormStyles.input}
            />
          </View>

          <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
            <TextInput
              label="Weight (kg)"
              mode="outlined"
              value={formData.weight.toString()}
              onChangeText={text => handleInputChange('weight', text)}
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
          </View>
        </FormFieldWrapper>

        <FormFieldWrapper>
          <View
            style={[vitalsStyles.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              label="Height (m)"
              value={formData.height.toString()}
              onChangeText={text => handleInputChange('height', text)}
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
            <TextInput
              mode="outlined"
              value={formData.sugar.toString()}
              onChangeText={text => handleInputChange('sugar', text)}
              label="Sugar"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
            <Text style={vitalsStyles.errorText}>{errorMessages.sugar}</Text>
          </View>
        </FormFieldWrapper>

        <FormFieldWrapper>
          <View
            style={[
              vitalsStyles.fieldContainer,
              {
                flex: 1,
                marginRight: 10,
                justifyContent: 'center',
                height: 55,
              },
            ]}>
            <Dropdown
              style={vitalsStyles.dropdown}
              placeholderStyle={vitalsStyles.placeholderStyle}
              selectedTextStyle={vitalsStyles.selectedTextStyle}
              inputSearchStyle={FormStyles.inputSearchStyle}
              iconStyle={vitalsStyles.iconStyle}
              containerStyle={vitalsStyles.dropdownContainerStyle}
              itemTextStyle={vitalsStyles.dropdownItemTextStyle}
              data={BpTypesOption}
              maxHeight={300}
              labelField="name"
              valueField="name"
              label="Select BP Type"
              value={formData?.bp_type}
              onChange={item => handleInputChange('bp_type', item)}
            />
          </View>

          <View
            style={[vitalsStyles.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              value={formData.systolic.toString()}
              onChangeText={text => handleInputChange('systolic', text)}
              label="Systolic"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
            <Text style={vitalsStyles.errorText}>{errorMessages.systolic}</Text>
          </View>

          <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
            <TextInput
              mode="outlined"
              value={formData.diastolic.toString()}
              onChangeText={text => handleInputChange('diastolic', text)}
              label="Diastolic"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
            <Text style={vitalsStyles.errorText}>
              {errorMessages.diastolic}
            </Text>
          </View>
        </FormFieldWrapper>

        <FormFieldWrapper>
          <View
            style={[vitalsStyles.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              value={formData.pulse.toString()}
              onChangeText={text => handleInputChange('pulse', text)}
              label="Pulse"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
            <TextInput
              mode="outlined"
              value={formData.cholesterol.toString()}
              onChangeText={text => handleInputChange('cholesterol', text)}
              label="Cholesterol"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
          </View>
        </FormFieldWrapper>

        <FormFieldWrapper>
          <View
            style={[vitalsStyles.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              value={formData.spo.toString()}
              onChangeText={text => handleInputChange('spo', text)}
              label="Spo2"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
            <TextInput
              mode="outlined"
              value={formData.respiratory.toString()}
              onChangeText={text => handleInputChange('respiratory', text)}
              label="Respiratory"
              style={FormStyles.input}
              keyboardType="decimal-pad"
            />
          </View>
        </FormFieldWrapper>
        {showMore ? (
          <View>
            <FormFieldWrapper style={{flexDirection: 'row'}}>
              <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
                <Text variant="labelMedium" style={{marginBottom: 10}}>
                  Covid Test
                </Text>
                <Dropdown
                  style={vitalsStyles.dropdown}
                  placeholderStyle={vitalsStyles.placeholderStyle}
                  selectedTextStyle={vitalsStyles.selectedTextStyle}
                  inputSearchStyle={FormStyles.inputSearchStyle}
                  iconStyle={vitalsStyles.iconStyle}
                  containerStyle={vitalsStyles.dropdownContainerStyle}
                  itemTextStyle={vitalsStyles.dropdownItemTextStyle}
                  data={CovidTestOptions}
                  maxHeight={300}
                  labelField="name"
                  valueField="name"
                  label="Select Covid Test"
                  value={formData?.covtest}
                  onChange={item => handleInputChange('covtest', item)}
                />
              </View>
            </FormFieldWrapper>

            <FormFieldWrapper style={{flexDirection: 'row'}}>
              <View style={{marginRight: 10, flex: 1}}>
                <TextInput
                  mode="outlined"
                  value={moment(formData?.covstartdate).format('DD-MM-YYYY')}
                  onPressIn={() => setStartDateModal(true)}
                  label="Covid Start Date"
                  style={[FormStyles.input, {height: 50}]}
                />
              </View>
              <DatePicker
                modal
                mode="date"
                open={startDateModal}
                date={formData?.covstartdate}
                maximumDate={new Date()}
                onConfirm={date => {
                  setStartDateModal(false);
                  handleChange('covstartdate', date);
                }}
                onCancel={() => setStartDateModal(false)}
              />
              <View style={{flex: 1}}>
                <TextInput
                  mode="outlined"
                  label="Covid End Date"
                  value={moment(formData?.covenddate).format('DD-MM-YYYY')}
                  onPressIn={() => setEndDateModal(true)}
                  style={[FormStyles.input, {height: 50}]}
                />
              </View>

              <DatePicker
                modal
                mode="date"
                open={endDateModal}
                date={formData?.covenddate}
                maximumDate={new Date()}
                onConfirm={date => {
                  setEndDateModal(false);
                  handleChange('covenddate', date);
                }}
                onCancel={() => setEndDateModal(false)}
              />
            </FormFieldWrapper>

            <View style={{flexDirection: 'row'}}>
              <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
                <TextInput
                  mode="outlined"
                  multiline
                  value={formData.remarks.toString()}
                  onChangeText={text => handleInputChange('remarks', text)}
                  label="Remarks"
                  style={[FormStyles.input, {height: 100}]}
                />
                <Text style={vitalsStyles.errorText}>
                  {errorMessages.remarks}
                </Text>
              </View>
            </View>

            <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
              <Text style={FormStyles.label}>Vaccine Status</Text>
              <Dropdown
                style={vitalsStyles.dropdown}
                placeholderStyle={vitalsStyles.placeholderStyle}
                selectedTextStyle={vitalsStyles.selectedTextStyle}
                inputSearchStyle={FormStyles.inputSearchStyle}
                iconStyle={vitalsStyles.iconStyle}
                containerStyle={vitalsStyles.dropdownContainerStyle}
                itemTextStyle={vitalsStyles.dropdownItemTextStyle}
                data={VaccineStatusOption}
                maxHeight={300}
                labelField="name"
                valueField="name"
                label="Select Vaccine Status"
                value={formData?.vaccinestatus}
                onChange={item => handleInputChange('vaccinestatus', item)}
              />
            </View>

            <FormFieldWrapper>
              <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
                <TextInput
                  mode="outlined"
                  value={formData.vaccinecompany.toString()}
                  onChangeText={text =>
                    handleInputChange('vaccinecompany', text)
                  }
                  label="Select Vaccine Company"
                  style={[FormStyles.input]}
                />
                <Text style={vitalsStyles.errorText}>
                  {errorMessages.vaccinecompany}
                </Text>
              </View>
            </FormFieldWrapper>

            <View>
              <FormFieldWrapper>
                <>
                  <View style={{flex: 1, marginRight: 10}}>
                    <TextInput
                      mode="outlined"
                      value={moment(formData?.firstdose).format('DD-MM-YYYY')}
                      onPressIn={() =>
                        setDateModal(prev => ({...prev, firstdose: true}))
                      }
                      label="First Dose"
                      style={[FormStyles.input, {height: 50}]}
                    />
                  </View>
                  <DatePicker
                    modal
                    mode="date"
                    open={dateModal?.firstdose}
                    date={formData?.firstdose}
                    maximumDate={new Date()}
                    onConfirm={date => {
                      setDateModal(prev => ({...prev, firstdose: false}));
                      handleChange('firstdose', date);
                    }}
                    onCancel={() =>
                      setDateModal(prev => ({...prev, firstdose: false}))
                    }
                  />
                </>

                <>
                  <View style={{flex: 1}}>
                    <TextInput
                      mode="outlined"
                      value={moment(formData?.seconddose).format('DD-MM-YYYY')}
                      onPressIn={() =>
                        setDateModal(prev => ({...prev, seconddose: true}))
                      }
                      label="Second Dose"
                      style={[FormStyles.input, {height: 50}]}
                    />
                  </View>
                  <DatePicker
                    modal
                    mode="date"
                    open={dateModal?.seconddose}
                    date={formData?.seconddose}
                    maximumDate={new Date()}
                    onConfirm={date => {
                      setDateModal(prev => ({...prev, seconddose: false}));
                      handleChange('seconddose', date);
                    }}
                    onCancel={() =>
                      setDateModal(prev => ({...prev, seconddose: false}))
                    }
                  />
                </>
              </FormFieldWrapper>
            </View>

            <FormFieldWrapper>
              <View
                style={[
                  vitalsStyles.fieldContainer,
                  {flex: 1, marginRight: 10},
                ]}>
                <TextInput
                  mode="outlined"
                  value={formData.vaccinecompany1.toString()}
                  onChangeText={text =>
                    handleInputChange('vaccinecompany1', text)
                  }
                  label="Vaccine Company 1"
                  style={FormStyles.input}
                />
                <Text style={vitalsStyles.errorText}>
                  {errorMessages.vaccinecompany1}
                </Text>
              </View>

              <View style={[vitalsStyles.fieldContainer, {flex: 1}]}>
                <TextInput
                  mode="outlined"
                  value={formData.vaccinecompany2.toString()}
                  onChangeText={text =>
                    handleInputChange('vaccinecompany2', text)
                  }
                  label="Vaccine Company 2"
                  style={FormStyles.input}
                />
                <Text style={vitalsStyles.errorText}>
                  {errorMessages.vaccinecompany2}
                </Text>
              </View>
            </FormFieldWrapper>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 15,
            }}>
            {/* <TouchableOpacity
              onPress={() => setShowMore(prev => !prev)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 8,
                backgroundColor: colorList.socondary,
                width: 120,
              }}>
              <Text style={{color: colorList.white, textAlign: 'center'}}>
                Show more
              </Text>
            </TouchableOpacity> */}
          </View>
        )}
      </ScrollView>

      {isloading ? (
        <CustomLoaderRound />
      ) : (
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              marginRight: 10,
            }}>
            <Button title="Cancel" onPress={close} color={colorList.primary} />
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <Button
              title="Submit"
              onPress={addVitalsApi}
              color={colorList.socondary}
            />
          </View>
        </View>
      )}
    </View>
  );
};
