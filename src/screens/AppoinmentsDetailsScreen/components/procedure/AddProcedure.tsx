import {useEffect, useState, memo} from 'react';
import {Alert, Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Button, Text, TextInput} from 'react-native-paper';
import {colorList} from '../../../../styles/global.styles';
import {CustomLoaderRound} from '../../../../components/CustomLoaderRound';
import moment from 'moment';
// import axios from 'axios';
import {API_URL} from '../../../../utils/constants';
import {
  procedureDiscountType,
  procedureStatusOptions,
} from '../../../../utils/constantOptions';
import DatePicker from 'react-native-date-picker';
import _ from 'lodash';
import {axiosInstance} from '../../../../config/axios.config.custom';

const FormFieldWrapper = ({children}: any) => {
  return (
    <View style={{flexDirection: 'row', marginVertical: 10}}>{children}</View>
  );
};

export const AddProcedure = memo(
  ({close, patientDetails, refetch, editData}: any) => {
    console.log('patientDetails', patientDetails?.id);
    const axios = axiosInstance;

    const [isloading, setLoader] = useState(false);
    const [procedureList, setProcedureList] = useState([]);
    const [procedureListFetched, setProcedureListFetched] = useState(false);
    const [startDateModal, setStartDateModal] = useState<boolean>(false);
    const [startDate, setStartDate] = useState(new Date());

    const [formData, setFormData] = useState({
      procedure_id: '',
      quantity: '1',
      price: '',
      note: '',
      discount: '',
      discount_type: procedureDiscountType[1],
      total: '',
      // teeths: '',
      intnote: '',
      // pdate: '',
      // edate: '',
      // appointment: '1',
      prostatus: 'Yes',
      status: procedureStatusOptions[0],
    });

    useEffect(() => {
      getProcedureListApi();
      return () => {
        setProcedureListFetched(false);
      };
    }, []);

    useEffect(() => {
      if (procedureList && editData) {
        console.log('Edit Dataaaaa', editData);
        const indexes = editData?.indexes;
        const obj = editData?.original[indexes];
        const indexProcedure = procedureList?.findIndex(
          fi => fi.procedure_name === obj?.procedure_name,
        );
        const indexStaus = procedureStatusOptions?.findIndex(
          fi => fi.name == obj?.status,
        );

        const indexprocedureDiscountType = procedureDiscountType?.findIndex(
          fi => fi.value === obj?.discount_type,
        );

        setFormData(prev => ({
          ...prev,
          procedure_id: procedureList[indexProcedure],
          quantity: obj?.quantity,
          price: obj?.cost,
          note: obj?.note,
          discount: obj?.discount,
          discount_type: procedureDiscountType[indexprocedureDiscountType],
          total: obj?.total,
          status: procedureStatusOptions[indexStaus],
        }));
      }
    }, [editData, procedureListFetched]);

    useEffect(() => {
      if (formData.discount !== '') {
        const total = Number(formData.quantity) * Number(formData.price);

        const totalPer = Number(formData.discount) / 100;
        if (formData?.discount_type?.name === '₹') {
          setFormData(prevFormData => ({
            ...prevFormData,
            total: total - Number(formData.discount),
          }));
        } else if (formData?.discount_type?.name === '%') {
          setFormData(prevFormData => ({
            ...prevFormData,
            total: Number(total) - Number(total) * Number(totalPer),
          }));
        }
      } else {
        setFormData(prevFormData => ({
          ...prevFormData,
          total: Number(prevFormData.quantity) * Number(prevFormData.price),
        }));
      }
    }, [
      formData.quantity,
      formData.price,
      formData.discount,
      formData.discount_type,
    ]);

    const [errors, setErrors] = useState({});

    const getProcedureListApi = (params = '') => {
      const Url =
        params !== ''
          ? `${API_URL.getProcedureMaster}?searchterm=${params}`
          : `${API_URL.getProcedureMaster}`;
      axios
        .get(Url)
        .then(res => {
          if (res?.data?.status === 200) {
            let temp = [];

            console.log(
              'res?.data?.data PRocedure List ===> ',
              res?.data?.data,
            );

            if (_.isEqual(res?.data?.data, [[]])) {
              temp = procedureList;
            } else temp = [...procedureList, ...res?.data?.data];
            setProcedureList(temp);
            setProcedureListFetched(true);
          } else Alert.alert('Warning', res?.data?.message);
        })
        .catch(err => {
          console.log('Errrrrrr', err.response.data);
          setProcedureList([]);
        });
    };

    const handleInputChange = (field, value) => {
      console.log('field, value ===>', field, value);
      // if (field === 'discount') {
      //   if (formData.discount_type.value == 'INR') {
      //     if (Number(value) > Number(formData?.procedure_id?.procedure_cost))
      //       setFormData(prevData => ({
      //         ...prevData,
      //         [field]: formData?.procedure_id?.procedure_cost,
      //       }));
      //   } else if (formData.discount_type.value == '%') {
      //     setFormData(prevData => ({
      //       ...prevData,
      //       [field]: 100,
      //     }));
      //   }
      // }

      if (field === 'procedure_id') {
        setFormData(prev => ({
          ...prev,
          price: value?.procedure_cost,
        }));
      }

      setFormData(prevData => ({
        ...prevData,
        [field]: value,
      }));

      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: '',
      }));
    };

    const validateForm = () => {
      let isValid = true;
      const newErrors = {};

      if (!formData.procedure_id || formData.procedure_id === '') {
        isValid = false;
        newErrors.procedure_id = 'Treatment is required';
      }
      if (!formData.quantity) {
        isValid = false;
        newErrors.quantity = 'Quantity is required';
      }
      if (!formData.price) {
        isValid = false;
        newErrors.price = 'Price is required';
      }

      // if (!formData.discount) {
      //   isValid = false;
      //   newErrors.discount = 'Discount is required';
      // }
      // if (!formData.discount_type) {
      //   isValid = false;
      //   newErrors.discount_type = 'Discount Type is required';
      // }
      // if (!formData.total) {
      //   isValid = false;
      //   newErrors.total = 'Discount Type is required';
      // }
      // if (!formData.status) {
      //   isValid = false;
      //   newErrors.status = ' required';
      // }

      setErrors(newErrors);
      return isValid;
    };

    const addProcedureApi = async () => {
      setLoader(true);

      const payload = {
        patient_id: patientDetails?.id,
        date: startDate
          ? moment(startDate).format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD'),
        items: {},
      };

      if (editData) {
        payload.unique_id = editData?.unique_id;

        const temp = [...editData?.original];

        temp[editData.indexes].cost = formData?.price;
        temp[editData.indexes].date_time = moment().format('YYYY-MM-DD');
        temp[editData.indexes].discount = formData?.discount;
        temp[editData.indexes].discount_type = formData?.discount_type?.value;
        temp[editData.indexes].note = formData?.note;
        temp[editData.indexes].procedure_id =
          formData?.procedure_id?.procedure_id;
        temp[editData.indexes].quantity = formData?.quantity;
        temp[editData.indexes].status = formData?.status?.name || '';
        temp[editData.indexes].total = formData?.total;

        const newArrOfArr = {};
        temp?.map((items: any, index: number) => {
          const newItem = {};
          Object.entries(items)?.map(([k, v]) => {
            if (k === 'cost') {
              newItem['price'] = v;
            } else if (k !== 'date_time' && k !== 'procedure_name') {
              newItem[k] = v;
            }

            return newItem;
          });
          newArrOfArr[index] = newItem;
        });

        payload.items = newArrOfArr;
      } else {
        payload.items = {
          '0': {
            ...formData,
            procedure_id: formData?.procedure_id?.procedure_id,
            discount_type: formData?.discount_type.value,
            status: formData.status.name,
          },
        };
      }

      console.log('Payloads Finals==== >', payload);

      try {
        const res = await axios.post(API_URL.addTreatments, payload);
        if (res && res.status === 200) {
          setLoader(false);
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
      } catch (err) {
        setLoader(false);
        console.error('Errr in post patient details', err.response.data);
        Alert.alert('Error', err?.response?.data?.message);
      }
    };

    const handleFormSubmit = () => {
      if (validateForm()) addProcedureApi();
    };

    return (
      <View style={stylesInetrnal.wrapper}>
        <ScrollView>
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

          <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
            <Text style={stylesInetrnal.label}>Procedure</Text>
            <Dropdown
              search
              onChangeText={text => text !== '' && getProcedureListApi(text)}
              style={stylesInetrnal.dropdown}
              placeholderStyle={stylesInetrnal.placeholderStyle}
              selectedTextStyle={stylesInetrnal.selectedTextStyle}
              inputSearchStyle={stylesInetrnal.inputSearchStyle}
              iconStyle={stylesInetrnal.iconStyle}
              containerStyle={stylesInetrnal.dropdownContainerStyle}
              itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
              data={procedureList}
              maxHeight={300}
              labelField="procedure_name"
              valueField="procedure_name"
              placeholder="Select a Procedure"
              value={formData?.procedure_id}
              onChange={item => handleInputChange('procedure_id', item)}
            />
            <Text style={stylesInetrnal.errorText}>{errors.procedure_id}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View
              style={[
                stylesInetrnal.fieldContainer,
                {flex: 1, marginRight: 10},
              ]}>
              <TextInput
                mode="outlined"
                value={formData.quantity.toString()}
                onChangeText={text => handleInputChange('quantity', text)}
                label="Quantity"
                style={stylesInetrnal.input}
                keyboardType="decimal-pad"
              />
              <Text style={stylesInetrnal.errorText}>{errors.quantity}</Text>
            </View>

            <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
              <TextInput
                mode="outlined"
                value={formData?.price?.toString()}
                onChangeText={text => handleInputChange('price', text)}
                label="Price"
                style={stylesInetrnal.input}
                keyboardType="decimal-pad"
              />
              <Text style={stylesInetrnal.errorText}>{errors.price}</Text>
            </View>
          </View>

          <View style={stylesInetrnal.fieldContainer}>
            <TextInput
              mode="outlined"
              multiline
              value={formData.note}
              onChangeText={text => handleInputChange('note', text)}
              label="Notes"
              style={[stylesInetrnal.input, {height: 100}]}
            />
            <Text style={stylesInetrnal.errorText}>{errors.note}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <View style={[stylesInetrnal.fieldContainer, {flex: 1}]}>
              <Text style={stylesInetrnal.label}>Disount Type</Text>
              <Dropdown
                style={stylesInetrnal.dropdown}
                placeholderStyle={stylesInetrnal.placeholderStyle}
                selectedTextStyle={stylesInetrnal.selectedTextStyle}
                inputSearchStyle={stylesInetrnal.inputSearchStyle}
                iconStyle={stylesInetrnal.iconStyle}
                containerStyle={stylesInetrnal.dropdownContainerStyle}
                itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
                data={procedureDiscountType}
                maxHeight={300}
                labelField="name"
                valueField="name"
                placeholder="Discount Type"
                value={formData?.discount_type}
                onChange={item => handleInputChange('discount_type', item)}
              />
              <Text style={stylesInetrnal.errorText}>
                {errors.discount_type}
              </Text>
            </View>
            <View
              style={[
                stylesInetrnal.fieldContainer,
                {flex: 1, marginLeft: 10},
              ]}>
              <TextInput
                label="Discount"
                mode="outlined"
                value={formData?.discount?.toString()}
                onChangeText={text => handleInputChange('discount', text)}
                style={stylesInetrnal.input}
                keyboardType="decimal-pad"
              />
              <Text style={stylesInetrnal.errorText}>{errors.discount}</Text>
            </View>
          </View>

          <View style={stylesInetrnal.fieldContainer}>
            <TextInput
              label="Total"
              mode="outlined"
              value={formData.total.toString()}
              onChangeText={text => handleInputChange('total', text)}
              style={stylesInetrnal.input}
              keyboardType="decimal-pad"
              editable={false}
            />
            <Text style={stylesInetrnal.errorText}>{errors.total}</Text>
          </View>

          <View>
            <Text style={stylesInetrnal.label}>Status </Text>
            <Dropdown
              style={stylesInetrnal.dropdown}
              placeholderStyle={stylesInetrnal.placeholderStyle}
              selectedTextStyle={stylesInetrnal.selectedTextStyle}
              inputSearchStyle={stylesInetrnal.inputSearchStyle}
              iconStyle={stylesInetrnal.iconStyle}
              containerStyle={stylesInetrnal.dropdownContainerStyle}
              itemTextStyle={stylesInetrnal.dropdownItemTextStyle}
              data={procedureStatusOptions}
              maxHeight={300}
              labelField="name"
              valueField="name"
              placeholder="Status"
              value={formData?.status}
              onChange={item => handleInputChange('status', item)}
            />
            <Text style={stylesInetrnal.errorText}>{errors.status}</Text>
          </View>

          {isloading ? (
            <CustomLoaderRound />
          ) : (
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                }}>
                <Button
                  mode="contained"
                  icon={"close"}
                  onPress={close}
                  style={{
                    backgroundColor: colorList.red
                  }}
                  labelStyle={{color: colorList.white}}>
                  Cancel
                </Button>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Button
                  mode="contained"
                  icon={"check"}
                  onPress={handleFormSubmit}
                  style={{backgroundColor: colorList.primary}}
                  labelStyle={{color: colorList.white}}>
                  Submit
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  },
);

export const stylesInetrnal = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width * 0.8,
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
    fontSize: 16,
    marginVertical: 5,
    color: colorList.Black,
  },
  input: {
    height: 40,
    // borderColor: colorList.Grey4,
    // borderWidth: 1,
    // marginBottom: 5,
    // paddingHorizontal: 10,
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
    // marginTop: 12,
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
