import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useCallback, useEffect, useState} from 'react';
import {styles} from './appoinmentDetails.styles';
import {CustomHeader} from '../../components/CustomHeader';
import {ArrowLeftIcon} from '../../assets';

import {CustomLoaderRound} from '../../components/CustomLoaderRound';
import {MenuListDetailsChiefComplaints} from './components/clinicalNotes/MenuListClinicalNotes';
import {MenuListDetailsFileList} from './components/files/MenuListFileLists';

import {PatientDetailsTiles} from '../../components/PatientDetailsTiles';
import {MenuListDetailsProcedure} from './components/procedure/MenuLIstProcedure';
import {MenuListDetailsVitalSigns} from './components/vitals/MenuLIstVitalSigns';
import {NavigationList} from '../../routes/NavigationList';
import {MenuListPrescription} from './components/prescription/MenuListPrescription';
import { getPatientService} from '../../services/getPatientList';
import {useFocusEffect} from '@react-navigation/native';

const MenuList = [
  {id: 1, name: 'Vital Signs'},
  {id: 2, name: 'Clinical notes'}, //'Chief Complaints'
  {id: 3, name: 'Procedure'}, //'Treatments'
  {id: 4, name: 'Prescription'},
  {id: 5, name: 'Add X-Rays/Photos/Files'},
];

const HorizontalMenus = ({id, name, focused, isFocused}: any) => {
  const focusedItem = isFocused === id;
  return (
    <TouchableOpacity
      onPress={focused}
      style={[
        styles.HorizontalMenusContainer,
        {borderWidth: isFocused === id ? 1 : 0},
      ]}>
      <Text
        style={
          focusedItem
            ? styles.HorizontalMenusFocusedText
            : styles.HorizontalMenusNormalText
        }>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export const AppoinmentDetails = ({navigation, route}: any) => {
  const {
    patientId,
    patientData,
    appointmentDetails = null,
    from = '',
  } = route.params;
  const [isFocused, setIsFocused] = useState(1);
  const [patientDetails, setPatientDetails] = useState(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (patientId) {
      getPatientDetails(patientId);
    }
  }, [patientId]);

  useFocusEffect(
    useCallback(() => {
      getPatientDetails(patientId);

      return () => {
        // console.log('Screen unfocused');
      };
    }, []),
  );

  const getPatientDetails = async (patientId: number) => {
    try {
      setLoading(true);
      const {data} = await getPatientService({id: patientId});
      setLoading(false);
      if (data?.status === 200) {
        setPatientDetails(data?.data[0]);
      } else {
        setPatientDetails(null);
      }
    } catch (error) {
      setLoading(false);
      console.error('Errors in getAppoinment Details....', error);
      setPatientDetails(null);
    }
  };

  if (isLoading) {
    return <CustomLoaderRound center />;
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <CustomHeader
            headerText={
              from === 'patient-list'
                ? 'Patient Details'
                : 'Appointment Details'
            }
            leftIcon={ArrowLeftIcon}
            leftIconAction={() => navigation.goBack()}
            rightText={'Edit'}
            rightTextAction={() =>
              appointmentDetails
                ? navigation.navigate(NavigationList.bookingAppoinment, {
                    data: {data: appointmentDetails, mode: 'edit'},
                  })
                : navigation.navigate(NavigationList.patientProfile, {
                    patientDetails,
                    mode: 'edit',
                  })
            }
          />
        </View>

        <View style={[styles.container]}>
          {isLoading ? (
            <CustomLoaderRound />
          ) : (
            <PatientDetailsTiles patientId={patientId} />
          )}
        </View>
        <View style={[styles.container, {flex: 1}]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              marginVertical: 10,
            }}>
            {MenuList?.map(item => {
              return (
                <HorizontalMenus
                  key={item?.id}
                  {...item}
                  isFocused={isFocused}
                  focused={() => setIsFocused(item.id)}
                />
              );
            })}
          </ScrollView>
        </View>
        <View style={{flex: 7.5, paddingHorizontal: 16}}>
          {patientDetails && isFocused === 1 ? (
            <MenuListDetailsVitalSigns patientDetails={patientDetails} />
          ) : isFocused === 2 ? (
            <MenuListDetailsChiefComplaints patientDetails={patientDetails} />
          ) : isFocused === 3 ? (
            <MenuListDetailsProcedure patientDetails={patientDetails} />
          ) : isFocused === 4 ? (
            <MenuListPrescription patientDetails={patientDetails} />
          ) : isFocused === 5 ? (
            <MenuListDetailsFileList patientDetails={patientDetails} />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
};
