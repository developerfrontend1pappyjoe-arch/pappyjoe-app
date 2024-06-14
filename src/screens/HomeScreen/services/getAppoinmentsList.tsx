import {API_URL} from '../../../utils/constants';
import {axiosInstance as axios} from '../../../config/axios.config.custom';

export const getAppoinments = async (params: any) => {
  try {
    const Url = `${API_URL.appointments}?${params}`;

    const res = await axios.get(Url);
    return res;
  } catch (error) {
    console.error('Errors ====> getAppoinments ', error);
    throw error;
  } finally {
  }
};
