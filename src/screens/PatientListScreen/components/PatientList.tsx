import React, { memo } from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { CallFillIcon, ProfileAvatar, WhatsAppIcon } from '../../../assets';
import { styles } from '../patientlist.styles';
import { PatientDataProps } from 'types/PatientDetailsTypes';


interface PatientListProps {
  data: PatientDataProps
  navigate: () => void
}

export const PatientList = memo(({ data, navigate }: PatientListProps) => {

  const openDialer = () =>
    Linking.openURL(`tel:${data?.country_code}${data?.mobile}`);

  const openWhatsApp = () => {
    Linking.openURL(
      `whatsapp://send?text=Hai&phone=${data?.country_code}${data?.mobile}`,
    );
  };

  return (
    <Surface style={styles.listContainer} >

      <TouchableOpacity style={styles.listImage} onPress={navigate}>
        <Image
          source={
            data.Photo !== '' && data?.Photo !== null
              ? { uri: data.Photo }
              : ProfileAvatar
          }
          style={{
            resizeMode: 'contain',
            width: 55,
            height: 55,
            borderRadius: 10,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.listContent} onPress={navigate}>
        <View style={styles.listContentWrapper}>
          <Text style={styles.listContentHeading}>{data?.Name?.trim()}</Text>
          <Text style={styles.listContentid}>ID : {data?.Patient_Id}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={[
          styles.listSocial,
          data?.phone === '' && { justifyContent: 'center' },
        ]}>
        {data?.mobile !== '' && (
          <TouchableOpacity
            onPress={openDialer}>
            <Image source={CallFillIcon} />
          </TouchableOpacity>
        )}
        {data?.mobile !== '' && (
          <TouchableOpacity
            onPress={openWhatsApp}
            style={{
              marginLeft: 15,
            }}>
            <Image source={WhatsAppIcon} />
          </TouchableOpacity>
        )}
      </View>
    </Surface>
  );
});

PatientList.displayName = 'PatientList';
