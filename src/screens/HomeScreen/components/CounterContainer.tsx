import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from '../home.style';
import {colorList} from '../../../styles/global.styles';

interface CounterConatainerType {
  value: string;
  isFocused: string;
  setIsFocused: () => void;
  text: string;
  count: number;
  loading: boolean;
};

export const CounterContainer = ({
  value,
  isFocused,
  setIsFocused,
  text,
  count,
  loading,
}: CounterConatainerType) => {
  const focused = isFocused === value;
  return (
    <TouchableOpacity
      onPress={setIsFocused}
      style={[
        styles.counterContainer,
        {
          backgroundColor: focused ? colorList.socondary : colorList.white,
        },
      ]}>
      <Text style={focused ? styles.counterNumber : styles.counterNumber1}>
        {loading ? '...' : focused ? count || 0 : '...'}
      </Text>
      <Text style={focused ? styles.counterLabel : styles.counterLabel1}>
        {text}
      </Text>
      <Text style={focused ? styles.counterLabel : styles.counterLabel1}>
        Appointments
      </Text>
    </TouchableOpacity>
  );
};
