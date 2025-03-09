import {axiosInstance as axios} from '../../../config/axios.config.custom';
import {API_URL} from '../../../utils/constants';
export const getPatientListService = async ({search,start,limit=10}:{search:string,start:number,limit?:number}) => {
  console.log("----------getPatientListService-----------",{search,start,limit})
  const res = await axios.get(`${API_URL.patientList}?limit=${limit}&start=${start}&searchterm=${search}`);
  return res.data;

  
};
