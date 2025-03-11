import {axiosInstance as axios} from '../../../config/axios.config.custom';
import {API_URL} from '../../../utils/constants';
export const getPatientListService = async ({search,start,limit=10,pid=null}:{search:string,start:number,limit:number,pid?:string | null}) => {
  console.log("----------getPatientListService-----------",{search,start,limit})
  console.log(pid);
 const url = Boolean(pid) ? `${API_URL.patientList}?pid=${pid}` : `${API_URL.patientList}?limit=${limit}&start=${start}&searchterm=${search}`
  const res = await axios.get(url);
  return res.data;
  // return pid

  
};
