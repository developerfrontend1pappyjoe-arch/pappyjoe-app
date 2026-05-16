// axiosInstance.js
import axios from "axios";
import { store } from "../redux/store";
import { attachUnauthorizedInterceptor } from "../services/sessionAuth.service";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = (store.getState() as { loginData?: { Authorization_Bearer?: string } })
      ?.loginData?.Authorization_Bearer;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

attachUnauthorizedInterceptor(axiosInstance);
attachUnauthorizedInterceptor(axios);

export { axiosInstance };