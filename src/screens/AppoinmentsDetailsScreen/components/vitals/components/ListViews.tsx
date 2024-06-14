import {View} from 'react-native';
import {colorList} from '../../../../../styles/global.styles';
import {Divider, Text} from 'react-native-paper';

export const ListViews = ({keys, val}: any) => {
  const capitalizeFirstLetter = (string: any) =>
    string.charAt(0).toUpperCase() + string.slice(1) + ' ';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: colorList.Grey6,
      }}>
      <View style={{flex: 1}}>
        <Text variant="labelMedium" style={{color: colorList.dark}}>
          {keys == 'spo'
            ? 'Spo2'
            : keys?.split('_').map((part: any) => capitalizeFirstLetter(part))}
        </Text>
      </View>

      <Text variant="labelMedium" style={{color: colorList.dark}}>
        {keys == 'spo'
          ? `${val} %`
          : keys == 'sugar' || keys == 'cholesterol'
          ? `${val} mg/dL`
          : keys == 'pulse' || keys == 'respiratory'
          ? `${val} BPM`
          : val}
      </Text>
      <Divider style={{marginVertical: 5}} />
    </View>
  );
};
