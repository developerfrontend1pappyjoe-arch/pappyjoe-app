import {Platform, StyleSheet, ViewStyle} from 'react-native';
import {FONT_FAMILY, FONT_SIZE, LINE_HEIGHT} from './typography';

export {FONT_SIZE, LINE_HEIGHT, FONT_FAMILY} from './typography';

export const ToasterTypes = {
  success: 'success',
  error: 'danger',
};

const fontWeight = {
  400: FONT_FAMILY.regular,
  500: FONT_FAMILY.medium,
  600: FONT_FAMILY.semiBold,
  700: FONT_FAMILY.bold,
};

export const globalStyles = StyleSheet.create({
  text24: {
    fontSize: FONT_SIZE.h1,
    lineHeight: LINE_HEIGHT.h1,
    fontFamily: fontWeight[600],
  },
  text22: {
    fontSize: FONT_SIZE.h2,
    lineHeight: LINE_HEIGHT.h2,
    fontFamily: fontWeight[600],
  },
  text14: {
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    fontFamily: fontWeight[400],
  },
  errorText: {
    color: 'red',
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
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
  warning:"#f57c00",
  palette:{
      primary:{
         light:"#1680C0",
         main:"#02AEED"
      },
      success:{
        light: '#54b94726',
        main: '#54B947',
      },
      warning:{
        light: "#FFECB3", 
        main: "#FF8A08",
      },
      error:{
        light:"#F6DED8",
        main:"#B82132"
      }
  }
};

/** Shared elevation for cards and raised surfaces */
export const elevationCard: ViewStyle = {
  backgroundColor: colorList.white,
  ...Platform.select({
    ios: {
      shadowColor: colorList.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
};

/** Top edge shadow for bottom navigation bar */
export const elevationNavBar: ViewStyle = {
  backgroundColor: colorList.white,
  ...Platform.select({
    ios: {
      shadowColor: colorList.dark,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
    },
    android: {
      elevation: 18,
    },
  }),
};
