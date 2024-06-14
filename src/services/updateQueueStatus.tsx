import {API_URL} from '../utils/constants';
import {axiosInstance as axios} from '../config/axios.config.custom';

interface updateQueueStatus {
  app_id: string;
  queuestatus: string;
}

export const updateQueueStatus = async (payload: updateQueueStatus) => {
  try {
    const res = await axios.put(API_URL.fixAppointment, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res?.data;
  } catch (err) {
    console.error('Error in getCountry List', err.response.data);
    return err.response.data;
  }
};
