import {axiosInstance as axios} from '../../../config/axios.config.custom';
import {API_URL} from '../../../utils/constants';

export const clinicalNotesMaster = async (params: string, search: string) => {
  try {
    const URL =
      search !== ''
        ? `${API_URL.getClinicalNotesMaster}?type=${params}&searchterm=${search}`
        : `${API_URL.getClinicalNotesMaster}?type=${params}`;
    console.log('Url ====> ', URL);

    const {data} = await axios.get(URL);
    return data;
  } catch (err) {
    console.log('Errror ===> in clinicalNotesMaster', err);
    return null;
  }
};
