// import axios from 'axios';
// import {useSelector} from 'react-redux';

// const data = useSelector(state => state?.loginData);

// axios.interceptors.request.use(
//   config => {
//     if (data?.Authorization_Bearer) {
//       config.headers.Authorization = `Bearer ${data?.Authorization_Bearer}`;
//     }

//     console.log('TOKEN -----> ', data);
//     return config;
//   },
//   error => {
//     console.error('Request Interceptor - Error:', error);
//     return Promise.reject(error);
//   },
// );

// export default axios;
