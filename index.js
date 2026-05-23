/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {enableScreens, enableFreeze} from 'react-native-screens';

enableScreens(true);
enableFreeze(true);

/** Default body font for React Native Text not using Paper variants */
const defaultTextStyle = {fontSize: 12, lineHeight: 16};
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = true;
Text.defaultProps.maxFontSizeMultiplier = 1.15;
Text.defaultProps.style = defaultTextStyle;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = true;
TextInput.defaultProps.maxFontSizeMultiplier = 1.15;

AppRegistry.registerComponent(appName, () => App);
