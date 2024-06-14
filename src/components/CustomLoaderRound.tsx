import {ActivityIndicator} from 'react-native';
import {colorList} from '../styles/global.styles';

export const CustomLoaderRound = ({center, color}: any) => (
  <ActivityIndicator
    size="large"
    color={color ? color : colorList.primary}
    style={center && {position: 'absolute', left: '45%', top: '45%'}}
  />
);
