import {Text, View} from 'react-native';
import {globalStyles} from '../styles/global.styles';

export const Errormessage = ({message = 'No Messages'}: any) => {
  return (
    <View style={{minHeight: 20, marginVertical: 3, marginLeft: 5}}>
      {message && <Text style={globalStyles.errorText}>{message}</Text>}
    </View>
  );
};
