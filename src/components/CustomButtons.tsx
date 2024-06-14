import {TouchableOpacity, View, Text} from 'react-native';
import {colorList} from '../styles/global.styles';

export const CustomButtons = ({onClick, btnName, width, noBg}: any) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: width || '100%',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: noBg ? colorList.white : colorList.primary,
        borderWidth: 1,
        borderColor: colorList.Grey4,
      }}>
      <Text
        style={{
          color: noBg ? colorList.Grey1 : colorList.white,
          fontSize: 14,
          fontWeight: '700',
        }}>
        {btnName}
      </Text>
    </TouchableOpacity>
  );
};
