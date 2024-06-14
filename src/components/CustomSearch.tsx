import React from 'react';
import {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colorList} from '../styles/global.styles';
import {CloseIcon, SearchIcon} from '../assets';

export const CustomSearch = ({
  value,
  handleOnChangeText,
  searchAction,
}: any) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colorList.white,
        borderRadius: 12,
        minHeight: 50,
      }}>
      <TextInput
        placeholder="Appointment Search Here.."
        placeholderTextColor={colorList.Grey4}
        value={value}
        onChangeText={text => handleOnChangeText(text)}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => (value !== '' ? searchAction('') : searchAction(value))}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          borderRadius: 12,
        }}>
        <Image
          source={value !== '' ? CloseIcon : SearchIcon}
          style={{width: 15, height: 15, tintColor: colorList.Grey1}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colorList.white,
    flex: 0.98,
    borderRadius: 12,
    paddingLeft: 10,
    color: colorList.dark,
  },
});
