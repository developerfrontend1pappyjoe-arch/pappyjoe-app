import {axiosInstance as axios} from '../../../config/axios.config.custom';
import {API_URL} from '../../../utils/constants';
import {patientList } from "../../../mockData"
export const getPatientListService = async ({params,limit}:{params: any, limit: string}) => {
  console.log("getPatientListService called");
  const Url =
    params !== ''
      ? `${API_URL.patientList}?${limit}&searchterm=${params}`
      : `${API_URL.patientList}?${limit}`;
  const res = await axios.get(Url);
  return res;
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(patientList); 
  //   },1500)
  // })
  
};
