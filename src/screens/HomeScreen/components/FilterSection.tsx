import React from 'react';
import {memo, useEffect, useState} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

import {CustomSearch} from '../../../components/CustomSearch';
import {CheckboxFillIcon, CloseIcon, FilterIcon} from '../../../assets';
import {colorList} from '../../../styles/global.styles';
// import axios from 'axios';
import {API_URL} from '../../../utils/constants';
import {useQuery} from '@tanstack/react-query';
import {CustomLoaderRound} from '../../../components/CustomLoaderRound';
import {useDispatch, useSelector} from 'react-redux';
import {handleHomeAppoinmentFilter} from '../../../redux/actions';
import {filterStyles} from './filterSection.styles';
import {axiosInstance} from '../../../config/axios.config.custom';

export const FilterSection = memo(
  ({
    refetch,
    isFocused,
    setShowFilterPopup,
    showFilterPopup,
    isFilter,
  }: any) => {
    const axios = axiosInstance;
    const dispatch = useDispatch();
    const homeAppoinmentFilter = useSelector<any>(
      state => state.homeAppoinmentFilter,
    );

    const [value, setValue] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState<string>('');
    const [isFocus, setIsFocus] = useState(false);
    const [doctersList, setDoctersList] = useState([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(
      moment().format('DD-MM-YYYY'),
    );
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const [statusList, setSelectedStatusList] = useState([
      {id: 1, status: 'Scheduled', isSelected: false},
      {id: 2, status: 'Waiting', isSelected: false},
      {id: 3, status: 'Engaged', isSelected: false},
      {id: 4, status: 'Checkout', isSelected: false},
      {id: 5, status: 'Cancelled', isSelected: false},
      {id: 6, status: 'Online', isSelected: false},
      {id: 7, status: 'Consulted', isSelected: false},
    ]);

    const getDoctorsList = async () => {
      try {
        const {data} = await axios.get(API_URL.doctorlist);
        setDoctersList(data.data);
      } catch (error) {
        console.error('Errors ====> Get Doctors List', error);
        throw error;
      }
    };

    useEffect(() => {
      getDoctorsList();
    }, []);

    useEffect(() => {
      if (doctersList && homeAppoinmentFilter?.doctor_id !== '') {
        setValue(homeAppoinmentFilter?.doctor_id);
      }
      if (homeAppoinmentFilter?.from_date !== '') {
        setSelectedDate(homeAppoinmentFilter?.from_date);
      }
      if (homeAppoinmentFilter?.patient_name !== '') {
        setSearchText(homeAppoinmentFilter?.patient_name);
      }
    }, [doctersList]);

    const openModal = () => setShowFilterPopup(true);
    const closeModal = () => setShowFilterPopup(false);

    const handleInputClick = () => setDatePickerVisible(true);
    const handleDatePickerClose = () => setDatePickerVisible(false);

    const handleChangeDoctor = (item: any) => {
      setValue(item.doctorid);
      setIsFocus(false);
    };

    const onDateChange = (date: any) => {
      setSelectedDate(moment(date).format('DD-MM-YYYY'));
      handleDatePickerClose();
    };

    const handleChangeStatus = (id: any) => {
      const temp = [...statusList];
      let selected: any = null;
      temp.forEach(el => {
        if (el.id !== id) {
          el.isSelected = false;
        } else {
          el.isSelected = true;
          selected = el;
        }
      });
      setSelectedStatusList(temp);
    };

    const handleReset = () => {
      setValue(null);
      setSelectedDate(null);
      setSelectedStatusList(prev =>
        prev.map(list => {
          list.isSelected = false;
          return list;
        }),
      );

      const temp = {...homeAppoinmentFilter};

      temp.doctor_id = '';
      temp.from_date =
        isFocused === '0'
          ? selectedDate || moment().format('DD-MM-YYYY')
          : moment().add(1, 'day').format('DD-MM-YYYY');
      temp.to_date =
        isFocused === '0' ? selectedDate || moment().format('DD-MM-YYYY') : '';
      temp.appointment_status = '';
      dispatch(handleHomeAppoinmentFilter(temp));
      setTimeout(() => {
        refetch();
        closeModal();
      }, 500);
    };

    const handleApply = () => {
      const status = statusList?.filter(item => item?.isSelected);

      const temp = {...homeAppoinmentFilter};
      temp.doctor_id = value ?? '';
      temp.from_date =
        isFocused === '0'
          ? selectedDate || moment().format('DD-MM-YYYY')
          : moment().add(1, 'day').format('DD-MM-YYYY');
      temp.to_date =
        isFocused === '0' ? selectedDate || moment().format('DD-MM-YYYY') : '';
      temp.appointment_status = status.length ? status[0].status : '';

      setTimeout(() => {
        dispatch(handleHomeAppoinmentFilter(temp));
      }, 100);

      setTimeout(() => {
        refetch();
      }, 200);
      setTimeout(() => {
        closeModal();
      }, 300);
    };

    useEffect(() => {
      searchAction(searchText);
    }, [searchText]);

    const handleSearchText = (text: string) => {
      setSearchText(text);
    };

    const searchAction = (search: string) => {
      handleSearchText(search);
      const temp = {...homeAppoinmentFilter};
      const status = statusList?.filter(item => item?.isSelected);
      temp.doctor_id = value ?? '';
      temp.from_date =
        isFocused === '0'
          ? selectedDate ?? moment().format('DD-MM-YYYY')
          : moment().add(1, 'day').format('DD-MM-YYYY');
      temp.to_date =
        isFocused === '0' ? selectedDate ?? moment().format('DD-MM-YYYY') : '';
      temp.appointment_status = status.length ? status[0].status : '';
      temp.patient_name = search;

      dispatch(handleHomeAppoinmentFilter(temp));
      setTimeout(() => {
        refetch();
      }, 50);
    };

    const [isChecked, setChecked] = useState(false);

    const handleToggle = () => {
      setChecked(!isChecked);
    };

    return (
      <View style={filterStyles.container}>
        <View style={{flex: 1, marginRight: 12}}>
          <CustomSearch
            value={searchText}
            handleOnChangeText={handleSearchText}
            searchAction={searchAction}
          />
        </View>
        <TouchableOpacity
          onPress={openModal}
          style={{
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            borderColor: colorList.primary,
          }}>
          {isFilter && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 50,
                backgroundColor: 'red',
                position: 'absolute',
                top: -3,
                right: 0,
              }}
            />
          )}
          <Image source={FilterIcon} />
        </TouchableOpacity>

        {showFilterPopup && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showFilterPopup}
            onRequestClose={closeModal}>
            <TouchableOpacity
              activeOpacity={1}
              style={filterStyles.modalContainer}>
              {isLoading ? (
                <CustomLoaderRound />
              ) : (
                <View
                  style={[
                    filterStyles.modalContent,
                    isDatePickerVisible && {width: '95%'},
                  ]}>
                  <TouchableOpacity
                    onPress={() =>
                      isDatePickerVisible
                        ? setDatePickerVisible(false)
                        : closeModal()
                    }
                    style={{
                      position: 'absolute',
                      top: -30,
                      right: 10,
                      backgroundColor: 'transparent',
                      padding: 5,
                      borderRadius: 100,
                    }}>
                    <Image
                      source={CloseIcon}
                      style={{
                        resizeMode: 'contain',
                        width: 18,
                        height: 18,
                        tintColor: '#fff',
                      }}
                    />
                  </TouchableOpacity>

                  {isDatePickerVisible ? (
                    <View>
                      <CalendarPicker onDateChange={onDateChange} />
                    </View>
                  ) : (
                    <View style={{flexDirection: 'column'}}>
                      <View style={{marginTop: 16}}>
                        <Text style={filterStyles.label}>Select Doctor</Text>
                        <Dropdown
                          search
                          style={[
                            filterStyles.dropdown,
                            isFocus && {borderColor: 'blue'},
                          ]}
                          placeholderStyle={filterStyles.placeholderStyle}
                          selectedTextStyle={filterStyles.selectedTextStyle}
                          inputSearchStyle={filterStyles.inputSearchStyle}
                          iconStyle={filterStyles.iconStyle}
                          itemContainerStyle={
                            filterStyles.dropdownContainerStyle
                          }
                          itemTextStyle={filterStyles.dropdownItemTextStyle}
                          data={doctersList}
                          maxHeight={300}
                          labelField="Name"
                          valueField="doctorid"
                          placeholder={'Select Doctor'}
                          searchPlaceholder="Search..."
                          value={value}
                          onFocus={() => setIsFocus(true)}
                          onBlur={() => setIsFocus(false)}
                          onChange={item => handleChangeDoctor(item)}
                        />
                      </View>

                      {isFocused !== '0' && (
                        <View style={{marginTop: 16}}>
                          <Text style={filterStyles.label}>Select Date</Text>
                          <TextInput
                            placeholder="Select Date"
                            value={selectedDate ? selectedDate?.toString() : ''}
                            onPressIn={handleInputClick}
                            style={filterStyles.inputSearchStyle}
                          />
                        </View>
                      )}

                      <View style={{marginTop: 16}}>
                        <Text style={filterStyles.label}>Status</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                          }}>
                          {statusList?.map(item => (
                            <TouchableOpacity
                              key={item?.id}
                              onPress={() => handleChangeStatus(item?.id)}
                              style={filterStyles.checkboxContainer}>
                              {item?.isSelected ? (
                                <Image
                                  source={CheckboxFillIcon}
                                  style={{
                                    marginRight: 8,
                                    width: 20,
                                    height: 20,
                                    resizeMode: 'contain',
                                  }}
                                />
                              ) : (
                                <View style={[filterStyles.checkbox]} />
                              )}
                              <Text style={filterStyles.labels}>
                                {item?.status}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 24,
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          onPress={() => handleReset()}
                          style={{
                            borderWidth: 1,
                            borderColor: colorList.Grey6,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '47%',
                            borderRadius: 12,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                          }}>
                          <Text
                            style={{
                              color: colorList.Grey1,
                              fontSize: 14,
                              fontWeight: '700',
                            }}>
                            Reset
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={handleApply}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '47%',
                            borderRadius: 12,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            backgroundColor: colorList.primary,
                          }}>
                          <Text
                            style={{
                              color: colorList.white,
                              fontSize: 14,
                              fontWeight: '700',
                            }}>
                            Apply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  },
);

FilterSection.displayName = 'FilterSection';
