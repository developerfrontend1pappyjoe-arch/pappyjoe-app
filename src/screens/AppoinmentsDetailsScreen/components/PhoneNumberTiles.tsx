import React from "react";
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../appoinmentDetails.styles';
import {CallFillIcon, CallIcon, WhatsAppCallIcon} from '../../../assets';
import Icons from "react-native-vector-icons/MaterialIcons";
import { colorList } from "styles/global.styles";
import { Button } from "react-native-paper";
export const PhoneNumberContainer = ({
  label,
  number = false,
  whatsapp = false,
  onPress,
  whatsAppAction,
}: any) => {
  return (
    <View style={styles.phoneContainar}>
      <View style={styles.leftSection}>
        <Image source={CallIcon} style={styles.leftSideImageStyle} />
        <Text style={styles.leftSidePhoneLabel}>{label}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.leftSidePhoneText}>{number || 'N.A'}</Text>
        {whatsapp && (
          <TouchableOpacity
            style={styles.rightSideImageWrapperStyle}
            onPress={whatsAppAction}>
            <Image
              source={WhatsAppCallIcon}
              style={styles.rightSideImageStyle}
            />
          </TouchableOpacity>
        )}
        {(number !== '' || !number) && (
          <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: colorList.white,
          }}
          >
            <Icons name="call" size={20}  color={colorList.primary} />
             </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
