import {API_URL} from '../utils/constants';
import {axiosInstance as axios} from '../config/axios.config.custom';

export const getDoctersList = async () => {
 try {
  const {data} = await axios.get(API_URL.doctorlist);
  return data;
 } catch (error) {
  return []
 }
  
};
