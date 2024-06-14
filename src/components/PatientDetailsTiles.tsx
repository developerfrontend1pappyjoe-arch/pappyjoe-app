import React,{memo, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from '../screens/AppoinmentsDetailsScreen/appoinmentDetails.styles';
import {ProfileAvatar} from '../assets';
import {PhoneNumberContainer} from '../screens/AppoinmentsDetailsScreen/components/PhoneNumberTiles';
import {CustomImageViewer} from '../screens/AppoinmentsDetailsScreen/components/files/ImageViewer';
import { getPatientService } from 'services/getPatientList';
import { CustomContentLoader } from './CustomContentLoader';
import { PatientDataProps,  } from 'types/PatientDetailsTypes';

interface PatientDetailsTileProps {
  patientId : string
}

interface ImageObject  {
  uri: string | undefined;
};


export const PatientDetailsTiles = memo(({patientId}: PatientDetailsTileProps) => {
  console.log("😇 ===> ",patientId);
  
  const [imageViews, setImageViews] = useState(false);
  const [imageViewData, setImageViewData] = useState<ImageObject[]>([]);
  const [patientDetails, setPatientDetails] = useState<PatientDataProps | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (patientId) {
      getPatientDetails(patientId);
    }
  }, [patientId]);

  const getPatientDetails = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await getPatientService({ id });
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

  const openDialer = () =>
    Linking.openURL(`tel:${patientDetails?.country_code}${patientDetails?.mobile}`);

  const openWhatsApp = () =>
    Linking.openURL(
      `whatsapp://send?text=Hai&phone=${patientDetails?.country_code}${patientDetails?.mobile}`,
    );

    if(isLoading) return <CustomContentLoader  tWidth={"50%"} pHeight={15} />
else
  return (
    <View style={styles.patientDetailsContainer}>
      <View>
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={{marginRight: 8}}
            onPress={()=>  patientDetails?.Photo !== "" ? 
            () => {
              setImageViewData([{uri: patientDetails?.Photo}]);
              setImageViews(true);
            }
          : Alert.alert("No Image Found")
          }>
            <Image
              source={patientDetails?.Photo ? {uri: patientDetails?.Photo} : ProfileAvatar}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View>
            <View style={styles.profileNameFilnoWrapper}>
              <Text style={styles.profileNameText}>{patientDetails?.Name || 'N.A'}</Text>
              {patientDetails?.File_No && (
                <View style={styles.profileFileNoContainer}>
                  <Text style={styles.profileFileNo}>File No.</Text>
                  <Text style={styles.profileFileNo}>
                    {patientDetails?.File_No || 'N.A'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.patientIdContainer}>
              <Text style={styles.profilePatientIdLabel}>Patient Id :</Text>
              <Text style={styles.profilePatientId}>
                {`${
                  patientDetails?.patient_code ? patientDetails?.patient_code : patientDetails?.Patient_Id
                }  ${
                  patientDetails?.gender !== 'undefined' ? `/ ${patientDetails?.gender} ` : ''
                }  ${patientDetails?.age ? `/ ${patientDetails?.age}` : ''}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.hrLine} />
        <PhoneNumberContainer
          label="Primary No."
          number={patientDetails?.mobile}
          onPress={openDialer}
          whatsapp
          whatsAppAction={openWhatsApp}
        />
        {patientDetails?.phone !== '' && (
          <View>
            <View style={styles.hrLine} />
            <PhoneNumberContainer
              label="Secondary No."
              number={patientDetails?.phone}
              onPress={openDialer}
            />
          </View>
        )}
      </View>

      {imageViews && imageViewData?.length && (
        <CustomImageViewer
          visible={imageViews}
          close={() => setImageViews(false)}
          img={imageViewData}
        />
      )}
    </View>
  );
});

PatientDetailsTiles.displayName = "PatientDetailsTiles"