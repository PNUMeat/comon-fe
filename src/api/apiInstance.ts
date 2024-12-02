import { handleCookieOnRedirect } from '@/utils/cookie';

import { ServerIntendedError } from '@/api/types';
import axios, { AxiosInstance, isAxiosError } from 'axios';

const apiInstance: AxiosInstance = axios.create({
  baseURL: `/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('intercept', error);
    if (isAxiosError(error) && error.response) {
      // const { status, message, code } = error.response
      console.log('axios', error.response);
      const { message } = error.response.data as ServerIntendedError;
      // if (code === 100) {
      //
      // }
      if (
        error.response.status === 401 &&
        message === '토큰이 만료되었습니다.'
      ) {
        apiInstance.get('api/v1/reissue').then(() => handleCookieOnRedirect());
        // return Promise.resolve();
      }
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
