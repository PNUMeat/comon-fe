import { handleCookieOnRedirect } from '@/utils/cookie';

import { ServerIntendedError } from '@/api/types';
import axios, { AxiosError, AxiosInstance } from 'axios';

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
  async (error: AxiosError<ServerIntendedError>) => {
    console.log('intercept', error);
    if (error.response) {
      console.log('error.response', error.response.data);
      const data = error.response.data;
      const { message } = data;
      if (
        error.response.status === 401 &&
        message === '토큰이 만료되었습니다.'
      ) {
        try {
          await apiInstance.get('v1/reissue');
          handleCookieOnRedirect();
          return Promise.resolve();
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
