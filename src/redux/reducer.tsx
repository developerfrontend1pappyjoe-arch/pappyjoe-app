import persistConfig from "../config/redux.config";
import { persistReducer } from "redux-persist";
import {
  ADD_LOGIN_DETAILS,
  GET_LOGIN_DETAILS,
  HOME_APPOINMENTS_FILTER,
  IS_LOGIN,
  REMOVE_LOGIN_DETAILS,
  PATIENT_ID,
  PATIENT_DETAILS,
  EDIT_INVOICE,
  EDIT_RECEIPT,
  BILLING_MODAL,
  SET_INVOICENO,
  SET_BILLING_DATE,
} from "./types";
import moment from "moment";
import { PatientDataProps } from "types/PatientDetailsTypes";
import { InvoiceSaveObjectType } from "screens/Billing/Invoice/types";

export interface StoreTypes {
  loginData: Object | null;
  isLoggedIn: boolean;
  homeAppoinmentFilter: Object;
  patientId: string | null;
  patientDetails: PatientDataProps | null;
  billing: {
    invoiceEditList: InvoiceSaveObjectType[];
    editDate:string;
    receiptEditList: any[];
    billingModalOpen:boolean,
    invoiceNo:string | null,
  };
}

const initialState: StoreTypes = {
  loginData: null,
  isLoggedIn: false,
  homeAppoinmentFilter: {
    appointment_status: "",
    from_date: moment().format("DD-MM-YYYY"),
    to_date: moment().format("DD-MM-YYYY"),
    patient_name: "",
    doctor_id: "",
  },
  patientId: null,
  patientDetails: null,
  billing: {
    invoiceEditList: [],
    receiptEditList: [],
    billingModalOpen:false,
    invoiceNo:null,
    editDate:moment().format("YYYY-MM-DD")
  },
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
        patientId: action.payload,
      };
    case PATIENT_DETAILS:
      return {
        ...state,
        patientDetails: action.payload,
      };
    case EDIT_INVOICE:
      return {
        ...state,
        billing: {
          ...state.billing,
          invoiceEditList: action.payload,
        },
      };
    case EDIT_RECEIPT:
      return {
        ...state,
        billing: {
          ...state.billing,
          receiptEditList: action.payload,
        },
      };
    case BILLING_MODAL:
      return {
        ...state,
        billing: {
          ...state.billing,
          billingModalOpen: action.payload,
        },
      };
    case SET_INVOICENO:
      return {
        ...state,
        billing: {
          ...state.billing,
          invoiceNo: action.payload,
        },
      };
    case SET_BILLING_DATE:
      return {
        ...state,
        billing: {
          ...state.billing,
          editDate: action.payload,
        },
      };
    default:
      return state;
  }
};

// const rootReducer = combineReducers({
//   loginDetails: addLoginDetails,
// });

const persistedReducer = persistReducer(persistConfig, commonReducer);

export default persistedReducer;
