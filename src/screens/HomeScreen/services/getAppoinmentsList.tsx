import {API_URL} from '../../../utils/constants';
import {axiosInstance as axios} from '../../../config/axios.config.custom';
const convertParamsToQueryString = (params: any) => {
  const filteredParams = Object.entries(params)
    ?.filter(([key, value]) => value !== '')
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const queryString = new URLSearchParams(filteredParams).toString();
  return queryString;
};

export const getAppoinments = async (params: any) => {
  const Url = `${API_URL.appointments}?${convertParamsToQueryString(params)}`;
  const res = (await axios.get(Url)).data;
  return res
};
