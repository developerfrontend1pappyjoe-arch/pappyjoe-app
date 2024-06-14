import {API_URL} from '../../../utils/constants';
import {LoginTypes} from '../../../types/login.types';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const saveLoginDetail = async (payload: LoginTypes) => {
  return axios.post(API_URL.login, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
