import React from 'react';
import {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Chip, Divider, Text, TextInput} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {deviceWidth} from 'utils/commonUtils';
import {CustomLoaderRound} from './CustomLoaderRound';
import {colorList} from 'styles/global.styles';
import {NoDataAvailable} from './NoDataAvailable';

interface CustomDropdownWithSearchProps {
  label: string;
  placeholder: string;
  isLoading: boolean;
  data: any;
  textInput: string;
  selectedItems: any;
  onChangeTextInput: (text: string) => void;
  onChangeSelect: (item: any) => void;
  OnChangeRemove: (item: any) => void;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  type: string;
}

export const CustomDropdownWithSearch = ({
  label,
  placeholder,
  isLoading,
  data,
  textInput,
  selectedItems,
  onChangeTextInput,
  onChangeSelect,
  OnChangeRemove,
  type,
}: CustomDropdownWithSearchProps) => {
  const onBlur = e => {
    console.log('Reeeeeee', e);
  };

  console.warn('complaintsItems==>', data);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}>
        <View
          style={{
            width: deviceWidth * 0.85,
            position: 'relative',
            marginBottom: 25,
          }}>
          {selectedItems?.length ? (
            <Divider style={{marginVertical: 5}} />
          ) : null}
          <View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {selectedItems[type]?.length
                ? selectedItems[type]?.map((it, index) => {
                    return (
                      <Chip
                        key={index}
                        mode="outlined"
                        onClose={() => OnChangeRemove(it)}
                        closeIcon={() => <Icons name="close" size={15} />}
                        style={{margin: 2, padding: 0}}
                        textStyle={{fontSize: 10, marginLeft: 10}}>
                        {it?.label}
                      </Chip>
                    );
                  })
                : null}
            </View>
            <Divider style={{marginVertical: 5}} />
          </View>

          <View style={{padding: 15}}>
            <TextInput
              mode="outlined"
              placeholder={placeholder ?? 'Search...'}
              value={textInput}
              onChangeText={text => onChangeTextInput(text)}
              onBlur={onBlur}
              right={
                <TextInput.Icon
                  onPress={
                    data?.length
                      ? () => onChangeTextInput('')
                      : () => onChangeSelect(null)
                  }
                  icon={() => (
                    <Icons
                      name={data?.length ? 'close' : 'add'}
                      size={23}
                      color={colorList.Black}
                    />
                  )}
                />
              }
              style={{
                height: 45,
              }}
            />

            {isLoading ? (
              <CustomLoaderRound />
            ) : (
              <ScrollView
                style={{
                  maxHeight: 250,
                }}>
                {data?.length ? (
                  data?.map(item => {
                    return (
                      <>
                        <Button
                          mode="text"
                          onPress={() => onChangeSelect(item)}
                          style={{
                            padding: 3,
                            borderRadius: 0,
                          }}
                          labelStyle={{
                            color: colorList.Black,
                            textAlign: 'left',
                          }}>
                          {item.label}
                        </Button>
                        <Divider />
                      </>
                    );
                  })
                ) : (
                  <NoDataAvailable />
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
