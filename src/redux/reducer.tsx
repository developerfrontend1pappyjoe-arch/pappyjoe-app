import persistConfig from '../config/redux.config';
import {persistReducer} from 'redux-persist';
import {
  ADD_LOGIN_DETAILS,
  GET_LOGIN_DETAILS,
  HOME_APPOINMENTS_FILTER,
  IS_LOGIN,
  REMOVE_LOGIN_DETAILS,
  PATIENT_ID
} from './types';
import moment from 'moment';

interface StoreTypes {
  loginData: Object | null;
  isLoggedIn: boolean;
  homeAppoinmentFilter: Object;
  patientId:string | null
}

const initialState: StoreTypes = {
  loginData: null,
  isLoggedIn: false,
  homeAppoinmentFilter: {
    appointment_status: '',
    from_date: moment().format('DD-MM-YYYY'),
    to_date: moment().format('DD-MM-YYYY'),
    patient_name: '',
    doctor_id: '',
  },
  patientId:null
};

const commonReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case HOME_APPOINMENTS_FILTER:
      return {
        ...state,
        homeAppoinmentFilter: action.payload,
      };
    case IS_LOGIN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case ADD_LOGIN_DETAILS:
      return {
        ...state,
        loginData: action.payload,
      };
    case GET_LOGIN_DETAILS:
      return {
        state,
      };
    case REMOVE_LOGIN_DETAILS:
      return {
        ...state,
        loginData: action.payload,
      };
      case PATIENT_ID:
        return {
          ...state,
          patientId:action.payload
        }
    default:
      return state;
  }
};

// const rootReducer = combineReducers({
//   loginDetails: addLoginDetails,
// });

const persistedReducer = persistReducer(persistConfig, commonReducer);

export default persistedReducer;
