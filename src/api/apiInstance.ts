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
  (error: AxiosError<ServerIntendedError>) => {
    if (error.response) {
      const data = error.response.data;
      const { message } = data;
      if (
        error.response.status === 401 &&
        message === '토큰이 만료되었습니다.'
      ) {
        return apiInstance.post('v1/reissue').then(() => {
          handleCookieOnRedirect();
          const originalRequest = error.config;
          if (originalRequest) {
            originalRequest.headers.set(
              'Authorization',
              `Bearer ${sessionStorage.getItem('Authorization')}`
            );

            return apiInstance(originalRequest);
          }
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
