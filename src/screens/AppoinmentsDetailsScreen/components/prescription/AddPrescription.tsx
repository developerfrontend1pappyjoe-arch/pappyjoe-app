// import axios from 'axios';
import {useEffect, useState} from 'react';
import {API_URL} from '../../../../utils/constants';
import {Alert, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {
  Badge,
  Button,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {colorList} from '../../../../styles/global.styles';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import moment from 'moment';
import {
  PrescriptionBeforeAfterOptions,
  PrescriptionDurationList,
} from '../../../../utils/constantOptions';
import DatePicker from 'react-native-date-picker';
import {axiosInstance} from '../../../../config/axios.config.custom';
import {ListPrescriptionForms} from './ListPrescriptionsForm';
import Icons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';

const FormFieldWrapper = ({children}: any) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 10}}>{children}</View>
  );
};

export const AddPrescriptionPopups = ({
  close,
  patientDetails,
  refetch,
  editData,
}: any) => {
  const axios = axiosInstance;

  const [isloading, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    medicine_id: '',
    strength: '',
    unit: '',
    duration: '',
    duration_type: PrescriptionDurationList[0],
    morning: '1',
    noon: '1',
    night: '1',
    food: PrescriptionBeforeAfterOptions[1],
    notes: '',
    musage: '',
    internalnote: '',
    review_date: '',
  });

  const [medicineList, setMedicineList] = useState<any>([]);
  const [usageList, setUsageList] = useState<any>([]);
  const [medicineUnit, setMedicineUnitList] = useState<any>([]);
  const [startDateModal, setStartDateModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(new Date());
  const [reviewDateModal, setReviewDateModal] = useState<boolean>(false);
  const [reviewDate, setReviewDate] = useState(new Date());
  const [formDataList, setFormDataList] = useState([]);
  const [errorMessages, setErrorMessages] = useState({
    medicine_id: '',
    duration: '',
  });
  const [errorMessagesList, setErrorMessagesList] = useState([]);
  const [fetchingCompleted, setFetchingCompleted] = useState(false);
  const [selectedPrescriptionTemplate, setSelectedPrescriptionTemplate] =
    useState(null);
  const [prescriptionTemplate, setPrescriptionTemplate] = useState({
    templates: [],
    medicines: [],
  });

  useEffect(() => {
    getMedicineListApi();
    getPrescriptionTemplate();
  }, []);

  useEffect(() => {
    if (editData && fetchingCompleted) {
      const temp = {...formData};
      const datas = editData?.original[editData?.indexes];

      if (datas) {
        const selectedFood = PrescriptionBeforeAfterOptions?.find(
          fi => fi?.name.toLowerCase() === datas?.food.toLowerCase(),
        );

        const units = medicineUnit?.find(fi => fi.id == datas?.unit);

        console.log('units ====> ', units);

        const usages = usageList?.find(fi => fi.text == datas?.usage);
        const durationTypes = PrescriptionDurationList?.find(
          fi => fi.text.toLowerCase() == datas?.duration_type.toLowerCase(),
        );

        const tempMed = {...datas?.medicinearray};
        tempMed.text = tempMed?.medicine;

        temp.medicine_id = tempMed;
        temp.strength = datas?.strength;
        temp.unit = units || '';
        temp.duration = datas?.duration;
        temp.duration_type = durationTypes;
        temp.morning = datas?.morning;
        temp.noon = datas?.noon;
        temp.night = datas?.night;
        temp.food = selectedFood
          ? selectedFood
          : PrescriptionBeforeAfterOptions[0];
        temp.notes = datas?.notes || '';
        temp.musage = usages || '';
        temp.internalnote = datas?.note || '';
        temp.review_date = datas?.review_date || '';

        setFormData(prev => ({...prev, ...temp}));
        setMedicineList(prev => {
          const newMedicineList = [...prev, tempMed];
          return newMedicineList;
        });
      }
    }
  }, [editData, medicineUnit, fetchingCompleted]);

  const getPrescriptionTemplate = async () => {
    const {data} = await axios.get(`${API_URL.getPrescriptionTemplatelist}`);
    const res = data?.data;
    const templatesList = Object.entries(res).map(([key, value]) => {
      const details = value.Details;
      return {
        id: key,
        ...details[0],
      };
    });

    const medicinesArray = Object.entries(res).map(([key, value]) => {
      return {
        id: key,
        Medicines: value.Medicines,
      };
    });

    setPrescriptionTemplate({
      templates: templatesList,
      medicines: medicinesArray,
    });
  };

  const handleSelectedTemplates = item => {
    setSelectedPrescriptionTemplate(item);
    const tempMedicineList = [...prescriptionTemplate?.medicines];
    const resultMedList = tempMedicineList?.find(fi => fi.id === item?.id);

    const tempPrescriptionList = [];
    const tempMediList = [...medicineList];

    resultMedList?.Medicines?.forEach(el => {
      const usageLists = usageList?.find(fi => fi.text == el?.usage);
      const medicinId = {
        id: el?.medicine_id,
        text: el?.medicinearray.medicine,
        strength: el?.medicinearray.strength,
        medicine_unit: el?.medicinearray.unit,
        instructions: el?.medicinearray.instructions,
      };

      const tempPrescriptionForm = {
        duration: el.duration,
        duration_type: PrescriptionDurationList?.find(
          fi => fi.text.toLowerCase() === el?.duration_type,
        ),
        food: PrescriptionBeforeAfterOptions?.find(
          fi => fi?.name.toLowerCase() === el?.food.toLowerCase(),
        ),
        internalnote: el.note || '',
        medicine_id: medicinId,
        morning: el?.morning,
        night: el?.night,
        noon: el?.noon,
        notes: el?.notes || '',
        strength: el?.strength,
        unit: medicineUnit?.find(fi => fi.id == el?.unit),
        usage: usageLists,
        musage: usageLists,
      };

      tempMediList.push(medicinId);
      tempPrescriptionList.push(tempPrescriptionForm);
    });
    setFormDataList(tempPrescriptionList);
    setMedicineList(tempMediList);
  };

  const getMedicineListApi = (params = '') => {
    setLoader(true);
    const Url =
      params !== ''
        ? `${API_URL.medicineMaster}?searchterm=${params}`
        : `${API_URL.medicineMaster}`;
    axios
      .get(Url)
      .then(res => {
        setLoader(false);
        const medList: any = [];
        Object.entries(res.data?.data).map(([k, v]) => {
          if (Array.isArray(v)) {
            if (k === 'usage') {
              const usageList = v.map((str, index) => ({
                id: index,
                text: str,
              }));
              setUsageList(usageList);
            } else if (k === 'medicine_unit') {
              setMedicineUnitList(v);
            }
          } else if (typeof v === 'object' && !Array.isArray(v)) {
            medList.push(v);
          }
        });
        setMedicineList(prev => [...prev, ...medList]);
      })
      .catch(err => {
        setLoader(false);
        setMedicineList(null);
        console.error('getMedicineListApi Error', err);
      })
      .finally(() => {
        setFetchingCompleted(true);
      });
  };

  const validateAndSubmit = () => {
    const requiredFields = ['medicine_id', 'duration'];

    let isValid = true;
    const newErrorMessages = [];
    formDataList?.forEach(el => {
      newErrorMessages.push({
        medicine_id: '',
        duration: '',
      });
    });

    requiredFields.forEach(field => {
      formDataList.forEach((el, index) => {
        if (!el[field] || el[field] === '') {
          newErrorMessages[index][field] = '* required';
          isValid = false;
        } else {
          newErrorMessages[index][field] = '';
        }
      });
    });

    setErrorMessagesList(newErrorMessages);

    if (isValid) {
      addPrescriptionApi();
    }
  };

  const autoFillMedicines = (data: any) => {
    const temp = medicineUnit.find(fi => fi.id === data?.medicine_unit);
    setFormData(prev => ({
      ...prev,
      unit: temp,
      strength: data?.strength,
      notes: data?.instructions,
    }));
  };

  const autoFillMedicinesList = (data: any, index: number) => {
    const temp = medicineUnit.find(fi => fi.id === data?.medicine_unit);

    const tempList = [...formDataList];

    tempList[index] = {
      ...tempList[index],
      unit: temp,
      strength: data?.strength,
      notes: data?.instructions,
    };

    setFormDataList(tempList);
  };

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));

    if (field === 'medicine_id') autoFillMedicines(value);

    setErrorMessages(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  const handleInputChangeList = (field, value, index) => {
    const temList = [...formDataList];
    temList[index][field] = value;

    setFormDataList(temList);

    if (field === 'medicine_id') autoFillMedicinesList(value, index);

    const tempErr = [...errorMessagesList];
    tempErr[index] = {
      ...tempErr[index],
      [field]: '',
    };
    setErrorMessagesList(tempErr);
  };

  const addPrescriptionApi = async () => {
    setLoader(true);
    const payload = {
      patient_id: patientDetails?.id,
      date:
        moment(startDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD'),
      items: {},
      review_date: reviewDate || moment().format('YYYY-MM-DD'),
    };

    if (editData) {
      const originalData = [...editData?.original];

      const temp = {
        medicine_id: formData?.medicine_id?.id,
        strength: formData?.strength,
        unit: formData?.unit?.id,
        duration: formData?.duration,
        duration_type: formData?.duration_type?.text,
        morning: formData?.morning,
        noon: formData?.noon,
        night: formData?.night,
        food: formData?.food.name || '',
        notes: formData?.notes || '',
        musage: formData?.musage?.text || '',
        internalnote: formData?.internalnote || '',
      };

      const newItem = {};
      originalData[editData?.indexes] = temp;
      originalData.forEach((el, index) => {
        newItem[`${index}`] = el;
      });
      payload.items = newItem;
    } else {
      formDataList?.forEach((el, index) => {
        console.log('el ====> ', el);

        if (el.duration_type) el.duration_type = el.duration_type.text;
        if (el.food) el.food = el?.food?.name || '';
        if (el.medicine_id) el.medicine_id = el.medicine_id.id;
        if (el.unit) el.unit = el.unit.id;
        if (el.musage) el.musage = el?.musage?.text || '';
        payload.items[`${index}`] = el;
      });
    }

    if (editData) payload.unique_id = editData?.unique_id;
    try {
      if (editData) {
        const res = await axios.post(API_URL.addPrescription, payload);
        if (res && res.status === 200) {
          setLoader(false);
          console.log('Resss Update Prescription', res.data);
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
        const res = await axios.post(API_URL.addPrescription, payload);

        if (res && res.status === 200) {
          setLoader(false);
          console.log('Resss', res.data);
          setTimeout(() => {
            Alert.alert('Success', res?.data?.message || 'Added Successfully', [
              {
                text: 'OK',
                onPress: () => {
                  refetch();
                  close();
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

  const [viewOptions, setViewOptions] = useState('AddPriscription');

  const handleAddPrescription = () => {
    const temp = {...formData};
    const tempArr = [...formDataList];

    const requiredFields = ['medicine_id', 'duration'];

    let isValid = true;
    const newErrorMessages = {...errorMessages};

    requiredFields.forEach(field => {
      console.log('formData[field]', field, formData.medicine_id);

      if (formData[field] === '' || !formData[field]) {
        newErrorMessages[field] = '* required';
        isValid = false;
      } else {
        newErrorMessages[field] = '';
      }
    });

    setErrorMessages(newErrorMessages);

    if (isValid) {
      tempArr.push(temp);
      setFormDataList(tempArr);
      setTimeout(() => {
        setFormData({
          medicine_id: '',
          strength: '',
          unit: '',
          duration: '',
          duration_type: PrescriptionDurationList[0],
          morning: '1',
          noon: '1',
          night: '1',
          food: PrescriptionBeforeAfterOptions[1],
          notes: '',
          musage: '',
          internalnote: '',
          review_date: '',
        });
      }, 200);
    }
  };

  return (
    <View style={stylesInetrnal.wrapper}>
      {formDataList?.length ? (
        <View style={{position: 'relative', top: 13, right: -13}}>
          <Badge>{formDataList?.length}</Badge>
        </View>
      ) : null}
      <SegmentedButtons
        value={viewOptions}
        onValueChange={val => {
          setViewOptions(val);
        }}
        density="medium"
        buttons={
          editData
            ? []
            : [
                {
                  value: 'AddPriscription',
                  label: 'Add Prescription',
                },
                {
                  value: 'ListPriscription',
                  label: 'List Prescription',
                },
              ]
        }
      />

      {viewOptions === 'AddPriscription' ? (
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View>
            <FormFieldWrapper>
              <View style={{marginRight: 10, flex: 1}}>
                <TextInput
                  mode="outlined"
                  value={moment(startDate).format('DD-MM-YYYY')}
                  onPressIn={() => setStartDateModal(true)}
                  label="Added Date"
                />
              </View>
              <DatePicker
                modal
                mode="date"
                open={startDateModal}
                date={startDate}
                maximumDate={new Date()}
                onConfirm={date => {
                  setStartDateModal(false);
                  setStartDate(date);
                }}
                onCancel={() => setStartDateModal(false)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper>
              <View style={{marginRight: 10, flex: 1}}>
                <TextInput
                  mode="outlined"
                  value={moment(reviewDate).format('DD-MM-YYYY')}
                  onPressIn={() => setReviewDateModal(true)}
                  label="Review Date"
                />
              </View>
              <DatePicker
                modal
                mode="date"
                open={reviewDateModal}
                date={reviewDate}
                // minimumDate={new Date()}
                onConfirm={date => {
                  setReviewDateModal(false);
                  setReviewDate(date);
                }}
                onCancel={() => setReviewDateModal(false)}
              />
            </FormFieldWrapper>

            {!editData && (
              <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
                <Text variant="labelMedium" style={stylesInetrnal.label}>
                  Prescription Template
                </Text>
                <Dropdown
                  search
                  onChangeText={text => text !== '' && getMedicineListApi(text)}
                  style={stylesInetrnal.dropdown}
                  placeholderStyle={stylesInetrnal.placeholderStyle}
                  selectedTextStyle={stylesInetrnal.selectedTextStyle}
                  inputSearchStyle={stylesInetrnal.inputSearchStyle}
                  iconStyle={stylesInetrnal.iconStyle}
                  containerStyle={stylesInetrnal.dropdownContainerStyle}
                  itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                  data={prescriptionTemplate?.templates}
                  maxHeight={300}
                  labelField="Template Name"
                  valueField="Template Name"
                  placeholder="Select Template"
                  value={selectedPrescriptionTemplate}
                  onChange={item => handleSelectedTemplates(item)}
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages?.medicine_id}
                </Text>
              </View>
            )}
            <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
              <Text variant="labelMedium" style={stylesInetrnal.label}>
                Medicine
              </Text>
              <Dropdown
                search
                onChangeText={text => text !== '' && getMedicineListApi(text)}
                style={stylesInetrnal.dropdown}
                placeholderStyle={stylesInetrnal.placeholderStyle}
                selectedTextStyle={stylesInetrnal.selectedTextStyle}
                inputSearchStyle={stylesInetrnal.inputSearchStyle}
                iconStyle={stylesInetrnal.iconStyle}
                containerStyle={stylesInetrnal.dropdownContainerStyle}
                itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                data={medicineList}
                maxHeight={300}
                labelField="text"
                valueField="text"
                placeholder="Select Medicine"
                value={formData?.medicine_id}
                onChange={item => handleInputChange('medicine_id', item)}
              />
              <Text style={stylesInetrnal.errorText}>
                {errorMessages?.medicine_id}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={[
                  stylesInetrnal.fieldContainer,
                  {
                    flex: 1,
                    marginRight: 10,
                  },
                ]}>
                <TextInput
                  mode="outlined"
                  value={formData.strength.toString()}
                  onChangeText={text => handleInputChange('strength', text)}
                  label="Strength"
                  style={stylesInetrnal.input}
                  keyboardType="decimal-pad"
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages.strength}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <Dropdown
                  search
                  style={[stylesInetrnal.dropdown, {marginVertical: 10}]}
                  placeholderStyle={stylesInetrnal.placeholderStyle}
                  selectedTextStyle={stylesInetrnal.selectedTextStyle}
                  inputSearchStyle={stylesInetrnal.inputSearchStyle}
                  iconStyle={stylesInetrnal.iconStyle}
                  containerStyle={stylesInetrnal.dropdownContainerStyle}
                  itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                  data={medicineUnit}
                  maxHeight={300}
                  labelField="medicine_unit"
                  valueField="medicine_unit"
                  placeholder="Select units"
                  value={formData?.unit}
                  onChange={item => handleInputChange('unit', item)}
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages.unit}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  stylesInetrnal.fieldContainer,
                  {flex: 1, marginRight: 10},
                ]}>
                <TextInput
                  mode="outlined"
                  value={formData.duration.toString()}
                  onChangeText={text => handleInputChange('duration', text)}
                  label="Duration"
                  style={stylesInetrnal.input}
                  keyboardType="decimal-pad"
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages.duration}
                </Text>
              </View>

              <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
                {/* <Text variant="labelMedium" style={stylesInetrnal.label}>
              Duration Type
            </Text> */}
                <Dropdown
                  style={stylesInetrnal.dropdown}
                  placeholderStyle={stylesInetrnal.placeholderStyle}
                  selectedTextStyle={stylesInetrnal.selectedTextStyle}
                  inputSearchStyle={stylesInetrnal.inputSearchStyle}
                  iconStyle={stylesInetrnal.iconStyle}
                  containerStyle={stylesInetrnal.dropdownContainerStyle}
                  itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                  data={PrescriptionDurationList}
                  maxHeight={300}
                  labelField="text"
                  valueField="text"
                  placeholder="Select duration"
                  value={formData?.duration_type}
                  onChange={item => handleInputChange('duration_type', item)}
                />
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  stylesInetrnal.fieldContainer,
                  {flex: 1, marginRight: 10},
                ]}>
                <TextInput
                  label="Morning"
                  mode="outlined"
                  value={formData.morning.toString()}
                  onChangeText={text => handleInputChange('morning', text)}
                  style={stylesInetrnal.input}
                  keyboardType="decimal-pad"
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages.morning}
                </Text>
              </View>
              <View
                style={[
                  stylesInetrnal.fieldContainer,
                  {flex: 1, marginRight: 10},
                ]}>
                <TextInput
                  mode="outlined"
                  value={formData.noon.toString()}
                  onChangeText={text => handleInputChange('noon', text)}
                  label="Noon"
                  style={stylesInetrnal.input}
                  keyboardType="decimal-pad"
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages.noon}
                </Text>
              </View>
              <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
                <TextInput
                  mode="outlined"
                  value={formData.night.toString()}
                  onChangeText={text => handleInputChange('night', text)}
                  label="Night"
                  style={stylesInetrnal.input}
                  keyboardType="decimal-pad"
                />
                <Text style={stylesInetrnal.errorText}>
                  {errorMessages.night}
                </Text>
              </View>
            </View>

            <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
              <Dropdown
                style={stylesInetrnal.dropdown}
                placeholderStyle={stylesInetrnal.placeholderStyle}
                selectedTextStyle={stylesInetrnal.selectedTextStyle}
                inputSearchStyle={stylesInetrnal.inputSearchStyle}
                iconStyle={stylesInetrnal.iconStyle}
                containerStyle={stylesInetrnal.dropdownContainerStyle}
                itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                data={PrescriptionBeforeAfterOptions}
                maxHeight={300}
                labelField="label"
                valueField="label"
                placeholder="Select Food"
                value={formData?.food}
                onChange={item => handleInputChange('food', item)}
              />
              <Text style={stylesInetrnal.errorText}>{errorMessages.food}</Text>
            </View>
            <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
              <Dropdown
                search
                style={stylesInetrnal.dropdown}
                placeholderStyle={stylesInetrnal.placeholderStyle}
                selectedTextStyle={stylesInetrnal.selectedTextStyle}
                inputSearchStyle={stylesInetrnal.inputSearchStyle}
                iconStyle={stylesInetrnal.iconStyle}
                containerStyle={stylesInetrnal.dropdownContainerStyle}
                itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                data={usageList}
                maxHeight={300}
                labelField="text"
                valueField="text"
                placeholder="Select usage"
                value={formData?.musage}
                onChange={item => handleInputChange('musage', item)}
              />
              <Text style={stylesInetrnal.errorText}>
                {errorMessages.musage}
              </Text>
            </View>

            <View
              style={[
                stylesInetrnal.fieldContainer,
                {flex: 1, marginRight: 10},
              ]}>
              <TextInput
                mode="outlined"
                multiline
                value={formData.notes.toString()}
                onChangeText={text => handleInputChange('notes', text)}
                label="General Notes"
                style={[stylesInetrnal.input, {height: 100}]}
                // keyboardType="decimal-pad"
              />
              <Text style={stylesInetrnal.errorText}>
                {errorMessages.notes}
              </Text>
            </View>
            <View
              style={[
                stylesInetrnal.fieldContainer,
                {flex: 1, marginRight: 10},
              ]}>
              <TextInput
                mode="outlined"
                multiline
                value={formData.internalnote.toString()}
                onChangeText={text => handleInputChange('internalnote', text)}
                placeholder="Internal Note"
                style={[stylesInetrnal.input, {height: 100}]}
              />
              <Text style={stylesInetrnal.errorText}>
                {errorMessages.internalnote}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ListPrescriptionForms
          dataList={formDataList}
          mediList={medicineList}
          errorMessagesList={errorMessagesList}
          setErrorMessagesList={setErrorMessagesList}
          handleInputChangeList={handleInputChangeList}
        />
      )}
      {isloading ? (
        <CustomLoaderRound />
      ) : (
        <>
          {viewOptions === 'AddPriscription' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
              }}>
              <Button
                mode="elevated"
                icon={'close'}
                onPress={close}
                style={{backgroundColor: colorList.red}}
                labelStyle={{color: colorList.white}}>
                Cancel
              </Button>

              <Button
                mode="elevated"
                icon={() => (
                  <Icons name="add-circle" size={20} color={colorList.white} />
                )}
                onPress={() =>
                  editData ? validateAndSubmit() : handleAddPrescription()
                }
                buttonColor={colorList.primary}
                textColor={colorList.white}>
                {editData ? 'Update' : 'Add Prescription'}
              </Button>
            </View>
          ) : (
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                }}>
                <Button
                  mode="elevated"
                  icon={'close'}
                  onPress={close}
                  style={{backgroundColor: colorList.red}}
                  labelStyle={{color: colorList.white}}>
                  Cancel
                </Button>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  mode="elevated"
                  icon={'check'}
                  onPress={validateAndSubmit}
                  style={{backgroundColor: colorList.primary}}
                  labelStyle={{color: colorList.white}}>
                  Submit
                </Button>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const stylesInetrnal = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width * 0.8,
    flex: 1,
    height: 'auto',
    maxHeight: Dimensions.get('screen').height * 0.78,
  },
  container: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  errorText: {
    color: 'red',
    marginTop: 2,
  },

  label: {
    // fontSize: 16,
    marginVertical: 5,
    color: colorList.Black,
  },
  input: {
    height: 40,
    borderColor: colorList.Grey4,
    borderRadius: 8,
    color: colorList.Black,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
  },

  rowContainer: {
    flexDirection: 'row',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    // marginTop: 2,
    fontSize: 14,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.dark,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 16,
    // borderWidth: 0.5,
    borderRadius: 8,
    // paddingLeft: 10,
    // marginTop: 16,
    color: colorList.dark,
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
  },
});
