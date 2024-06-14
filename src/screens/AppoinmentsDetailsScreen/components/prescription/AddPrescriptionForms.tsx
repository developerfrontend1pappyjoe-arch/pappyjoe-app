import moment from 'moment';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {Text, TextInput} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {colorList} from '../../../../styles/global.styles';
import {
  PrescriptionBeforeAfterOptions,
  PrescriptionDurationList,
} from '../../../../utils/constantOptions';
import {API_URL} from '../../../../utils/constants';
import {axiosInstance as axios} from '../../../../config/axios.config.custom';

export const FormFieldWrapper = ({children}: any) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 10}}>{children}</View>
  );
};

export const AddPrescriptionForm = ({
  data,
  mediList,
  errorMessagesList,
  setErrorMessagesList,
  indexMessage,
  handleInputChangeList,
}: any) => {
  const [errorMessages, setErrorMessages] = useState({
    medicine_id: '',
    duration: '',
  });

  const [medicineList, setMedicineList] = useState<any>([]);
  const [usageList, setUsageList] = useState<any>([]);
  const [medicineUnit, setMedicineUnitList] = useState<any>([]);
  const [isloading, setLoader] = useState(false);

  console.log('Finalzzzz data===============', data);

  useEffect(() => {
    getMedicineListApi();
  }, []);

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

        if (mediList?.length) {
          setMedicineList(prev => [...prev, ...medList, ...mediList]);
        } else setMedicineList(prev => [...prev, ...medList]);
      })
      .catch(err => {
        setLoader(false);
        setMedicineList(null);
        console.error('getMedicineListApi Error', err);
      });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
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
            value={data?.medicine_id}
            onChange={item =>
              handleInputChangeList('medicine_id', item, indexMessage)
            }
          />
          <Text style={stylesInetrnal.errorText}>
            {errorMessagesList?.medicine_id}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 0,
          }}>
          <View
            style={[stylesInetrnal.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              value={data?.strength.toString()}
              onChangeText={text =>
                handleInputChangeList('strength', text, indexMessage)
              }
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
              style={stylesInetrnal.dropdown}
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
              value={data?.unit}
              onChange={item =>
                handleInputChangeList('unit', item, indexMessage)
              }
            />
            <Text style={stylesInetrnal.errorText}>{errorMessages.unit}</Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View
            style={[stylesInetrnal.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              value={data?.duration.toString()}
              onChangeText={text =>
                handleInputChangeList('duration', text, indexMessage)
              }
              label="Duration"
              style={stylesInetrnal.input}
              keyboardType="decimal-pad"
            />
            <Text style={stylesInetrnal.errorText}>
              {errorMessagesList?.duration}
            </Text>
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
              data={PrescriptionDurationList}
              maxHeight={300}
              labelField="text"
              valueField="text"
              placeholder="Select duration"
              value={data?.duration_type}
              onChange={item =>
                handleInputChangeList('duration_type', item, indexMessage)
              }
            />
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View
            style={[stylesInetrnal.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              label="Morning"
              mode="outlined"
              value={data?.morning.toString()}
              onChangeText={text =>
                handleInputChangeList('morning', text, indexMessage)
              }
              style={stylesInetrnal.input}
              keyboardType="decimal-pad"
            />
            <Text style={stylesInetrnal.errorText}>
              {errorMessages.morning}
            </Text>
          </View>
          <View
            style={[stylesInetrnal.fieldContainer, {flex: 1, marginRight: 10}]}>
            <TextInput
              mode="outlined"
              value={data?.noon.toString()}
              onChangeText={text =>
                handleInputChangeList('noon', text, indexMessage)
              }
              label="Noon"
              style={stylesInetrnal.input}
              keyboardType="decimal-pad"
            />
            <Text style={stylesInetrnal.errorText}>{errorMessages.noon}</Text>
          </View>
          <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
            <TextInput
              mode="outlined"
              value={data?.night.toString()}
              onChangeText={text =>
                handleInputChangeList('night', text, indexMessage)
              }
              label="Night"
              style={stylesInetrnal.input}
              keyboardType="decimal-pad"
            />
            <Text style={stylesInetrnal.errorText}>{errorMessages.night}</Text>
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
            value={data?.food}
            onChange={item => handleInputChangeList('food', item, indexMessage)}
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
            value={data?.musage}
            onChange={item =>
              handleInputChangeList('musage', item, indexMessage)
            }
          />
          <Text style={stylesInetrnal.errorText}>{errorMessages.musage}</Text>
        </View>

        <View
          style={[stylesInetrnal.fieldContainer, {flex: 1, marginRight: 10}]}>
          <TextInput
            mode="outlined"
            multiline
            value={data?.notes.toString()}
            onChangeText={text =>
              handleInputChangeList('notes', text, indexMessage)
            }
            label="General Notes"
            style={[stylesInetrnal.input, {height: 80}]}
          />
          <Text style={stylesInetrnal.errorText}>{errorMessages.notes}</Text>
        </View>
        <View
          style={[stylesInetrnal.fieldContainer, {flex: 1, marginRight: 10}]}>
          <TextInput
            mode="outlined"
            multiline
            value={data?.internalnote?.toString() || ''}
            onChangeText={text =>
              handleInputChangeList('internalnote', text, indexMessage)
            }
            placeholder="Internal Note"
            style={[stylesInetrnal.input, {height: 80}]}
          />
          <Text style={stylesInetrnal.errorText}>
            {errorMessages.internalnote}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const stylesInetrnal = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width * 0.8,
    flex: 1,
    height: 'auto',
    maxHeight: Dimensions.get('screen').height * 0.8,
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
    marginBottom: 5,
    color: colorList.Black,
  },
  input: {
    height: 35,
    borderColor: colorList.Grey4,
    borderRadius: 8,
    color: colorList.Black,
    fontSize: 13,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 5,
  },

  rowContainer: {
    flexDirection: 'row',
  },
  dropdown: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 13,
    color: colorList.dark,
  },
  placeholderStyle: {
    fontSize: 14,
    fontWeight: '400',
    color: colorList.dark,
  },
  selectedTextStyle: {
    fontSize: 13,
    fontWeight: '400',
    color: colorList.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 35,
    fontSize: 13,
    borderRadius: 8,
    color: colorList.dark,
  },
  dropdownContainerStyle: {
    backgroundColor: colorList.white,
  },
  dropdownItemTextStyle: {
    color: colorList.dark,
    fontSize: 13,
  },
});
