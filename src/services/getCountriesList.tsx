import {API_URL} from '../utils/constants';
import {axiosInstance as axios} from '../config/axios.config.custom';

export const getCountriesList = async () => {
  try {
    const res = await axios.get(API_URL.countryList, {
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJjbGluaWNfaWQiOiI5OTIzMjc1OSIsInVzZXJfaWQiOiI0MDU5NjgiLCJzcGVjaWFsaXphdGlvbiI6IjMifQ.wF9NQE9QS-l8PHBLP2tB76tvWLGR9hG8rjcWqkn775A',
      },
    });
    return res?.data;
  } catch (err) {
    console.error('Error in getCountry List', err.response.data);
    return err.response.data;
  }
};
