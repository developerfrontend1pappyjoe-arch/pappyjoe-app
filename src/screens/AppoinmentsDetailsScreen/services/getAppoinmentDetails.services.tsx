import {API_URL} from '../../../utils/constants';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const getAppoinmentDetails = (appoinmentId: number) =>
  axios.get(`${API_URL.appointments}?app_id=${appoinmentId}`);
