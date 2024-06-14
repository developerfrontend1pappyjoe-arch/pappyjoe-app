// axiosInstance.js
import axios from 'axios';
import {store} from '../redux/store'; // assuming you have a Redux store set up

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    const token = store.getState().loginData?.Authorization_Bearer;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
