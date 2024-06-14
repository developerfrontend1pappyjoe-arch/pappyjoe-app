import {axiosInstance as axios} from '../../../config/axios.config.custom';
import {API_URL} from '../../../utils/constants';

export const getPatientListService = async (params: any, limit: string) => {
  const Url =
    params !== ''
      ? `${API_URL.patientList}?${limit}&searchterm=${params}`
      : `${API_URL.patientList}?${limit}`;
  console.log('Urlll ====>>>', Url);

  const res = await axios.get(Url);
  return res;
};
