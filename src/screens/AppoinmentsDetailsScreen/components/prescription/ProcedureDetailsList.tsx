import React from 'react';
import {View} from 'react-native';
import {Divider, Text} from 'react-native-paper';

export const ProcedureDetailsList = ({
  keys,
  val,
  durationType,
  strengthUnit,
}: any) => {
  const capitalizeFirstLetter = (string: any) =>
    string.charAt(0).toUpperCase() + string.slice(1) + ' ';
  return (
    <View
      style={{
        borderRadius: 12,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 5,
          marginVertical: 5,
        }}>
        <View
          style={{
            flex: 1,
            height: 15,
          }}>
          <Text variant="labelMedium">
            {keys === 'note'
              ? 'Internal Notes'
              : keys
                  ?.split('_')
                  .map((part: any) => capitalizeFirstLetter(part))}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text variant="labelMedium" style={{textTransform: 'capitalize'}}>
            {keys === 'duration'
              ? `${val} ${durationType}`
              : keys === 'strength'
              ? `${val} ${strengthUnit}`
              : val}
          </Text>
        </View>
        <Divider />
      </View>
    </View>
  );
};

export default ProcedureDetailsList;
