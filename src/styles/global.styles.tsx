import {StyleSheet} from 'react-native';

export const ToasterTypes = {
  success: 'success',
  error: 'danger',
};

const fontWeight = {
  400: 'Inter-Regular',
  500: 'Inter-Medium',
  600: 'Inter-SemiBold',
  700: 'Inter-Bold',
};

export const globalStyles = StyleSheet.create({
  text24: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold', // 600
  },
  text22: {
    fontSize: 22,
    fontFamily: fontWeight[600],
  },
  text14: {
    fontSize: 14,
    fontFamily: fontWeight[400],
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    paddingVertical: 5,
  },
});

export const colorList = {
  primary: '#02AEED',
  socondary: '#54B947',
  blue: '#1680C0',
  blue_100: '#091228',
  blue_200: '#314371',
  blue_300: '#92A1C8',
  blue_400: '#CBD5EC',
  blue_900: '#F5FBFE',
  white: '#fff',
  dark: '#262733',
  Grey1: '#919199',
  Grey2: '#B9B9BD',
  Grey3: '#A9B0B2',
  Grey4: '#C3C3C7',
  Grey5: '#F2F2F2',
  Grey6: '#EDEDED',
  Grey7: '#f1f1f185',
  GreyDark1: '#545454',
  Black: '#000',
  Green: '#54b94726',
  red: '#cc0000',
};
