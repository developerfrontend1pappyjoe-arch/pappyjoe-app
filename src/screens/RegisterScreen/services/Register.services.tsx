import {RegisterTypes} from '../../../types/login.types';
import {API_URL} from '../../../utils/constants';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const saveRegisterDetails = async (payload: RegisterTypes) => {
  const res = await axios.post(API_URL.register, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};
