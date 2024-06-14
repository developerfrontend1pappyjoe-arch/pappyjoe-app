import axios from 'axios';

export const submitObservations = async data => {
  const token = await getToken();
  const body = JSON.stringify(data);
  try {
    const result = await axios.post(`/mobapi/clinicnotes`, body, token);
    return result;
  } catch (error) {
    return {message: 'Something went wrong'};
  }
};
