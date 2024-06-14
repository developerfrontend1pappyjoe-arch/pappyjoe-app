import {API_URL} from '../../../utils/constants';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const getClinicDetails = async (id: any) => {
  try {
    const res = await axios.get(`${API_URL.clinicList}?Unique_Id=${id}`);
    return res?.data;
  } catch (error) {
    console.error('Errors ====> get Clinic Details in Home', error);
    throw error;
  }
};
