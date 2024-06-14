import {API_URL} from '../utils/constants';
import {axiosInstance as axios} from '../config/axios.config.custom';

interface getPatientsListTypes {
  id?: string | number;
  search?: string;
}

export const getPatientService = async (params: getPatientsListTypes) => {
  const Url =
    params?.id && params?.id !== ''
      ? `${API_URL.patientList}?pid=${params?.id}`
      : params && params?.search !== ''
        ? `${API_URL.patientList}?searchterm=${params?.search}`
        : `${API_URL.patientList}`;

  console.log('Url ===> ', Url);

  const res = await axios.get(Url);

  return res;
};
