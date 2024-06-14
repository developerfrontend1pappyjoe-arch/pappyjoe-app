import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'root', // key for the root of the state object
  storage: AsyncStorage, // storage engine for persisting state (AsyncStorage in this case)
};

export default persistConfig;
