/**
 * @format
 * gesture-handler must be the first import (required for navigation / bottom-sheet).
 */
import 'react-native-gesture-handler';

import {AppRegistry, Platform, Text, TextInput} from 'react-native';
import {enableScreens} from 'react-native-screens';
import App from './App';
import {name as appName} from './app.json';

enableScreens(true);
// Screen freezing breaks navigation on Android 10/11 (API 29–30).
const canEnableScreenFreeze =
  Platform.OS === 'ios' ||
  (Platform.OS === 'android' && Platform.Version >= 31);
if (canEnableScreenFreeze) {
  const {enableFreeze} = require('react-native-screens');
  enableFreeze(true);
}

/** Default body font for React Native Text not using Paper variants */
const defaultTextStyle = {fontSize: 12, lineHeight: 16};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = true;
Text.defaultProps.maxFontSizeMultiplier = 1.15;
Text.defaultProps.style = defaultTextStyle;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = true;
TextInput.defaultProps.maxFontSizeMultiplier = 1.15;

if (__DEV__) {
  const defaultHandler = global.ErrorUtils?.getGlobalHandler?.();
  global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
    console.error('[PappyJoe fatal]', isFatal, error);
    defaultHandler?.(error, isFatal);
  });
}

AppRegistry.registerComponent(appName, () => App);
