// actions.js
import { InvoiceSaveObjectType } from 'screens/Billing/Invoice/types';
import {
  ADD_LOGIN_DETAILS,
  GET_LOGIN_DETAILS,
  HOME_APPOINMENTS_FILTER,
  IS_LOGIN,
  REMOVE_LOGIN_DETAILS,
  PATIENT_ID,
  PATIENT_DETAILS,
  EDIT_INVOICE
} from './types';

export const handleHomeAppoinmentFilter = (payload: any) => {
  return {
    type: HOME_APPOINMENTS_FILTER,
    payload,
  };
};

export const handleLoggedInStatus = (payload: any) => {
  return {
    type: IS_LOGIN,
    payload,
  };
};

export const addLoginDetails = (payload: any) => {
  return {
    type: ADD_LOGIN_DETAILS,
    payload,
  };
};

// Action creator for removing login details
export const removeLoginDetails = () => {
  return {
    type: REMOVE_LOGIN_DETAILS,
    payload: null,
  };
};

export const setPatientId = (payload:string | null)=>{
   return {
      type:PATIENT_ID,
      payload
   }
}

export const assignPatientDetails = (payload:any)=>{
   return {
      type:PATIENT_DETAILS,
      payload
   }
}

export const editInvoiceList = (payload:InvoiceSaveObjectType[])=>{
    return {
       type:EDIT_INVOICE,
       payload
    }
}