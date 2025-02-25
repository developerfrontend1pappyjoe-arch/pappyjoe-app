// actions.js
import {
  ADD_LOGIN_DETAILS,
  GET_LOGIN_DETAILS,
  HOME_APPOINMENTS_FILTER,
  IS_LOGIN,
  REMOVE_LOGIN_DETAILS,
  PATIENT_ID,
  PATIENT_DETAILS
} from './types';

export const handleHomeAppoinmentFilter = (data: any) => {
  return {
    type: HOME_APPOINMENTS_FILTER,
    payload: data,
  };
};

export const handleLoggedInStatus = (data: any) => {
  return {
    type: IS_LOGIN,
    payload: data,
  };
};

export const addLoginDetails = (data: any) => {
  return {
    type: ADD_LOGIN_DETAILS,
    payload: data,
  };
};

// Action creator for removing login details
export const removeLoginDetails = () => {
  return {
    type: REMOVE_LOGIN_DETAILS,
    payload: null,
  };
};

export const setPatientId = (id:string | null)=>{
   return {
      type:PATIENT_ID,
      payload:id
   }
}

export const assignPatientDetails = (data:any)=>{
   return {
      type:PATIENT_DETAILS,
      payload:data
   }
}
