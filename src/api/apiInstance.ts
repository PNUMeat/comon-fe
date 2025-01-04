import { handleCookieOnRedirect } from '@/utils/cookie';

import { ServerIntendedError } from '@/api/types';
import { PATH } from '@/routes/path';
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
    /**
     * 응답이 401이고, 401의 원인이 access token이 만료된 경우,
     * refresh token을 통해 access token을 재발급 받은후,
     * 재발급한 access token을 통해 재요청한다.
     * access token을 재발급 받을 때, "이전 로그인 정보를 통해 재입장중입니다."라는 느낌의 토스트 메세지를 띄웠으면 좋겠음
     * 대기시간이 길어지는 이유를 설명하고 싶음.
     */
    if (error.response) {
      const data = error.response.data;
      const { code } = data;
      if (error.response.status === 401) {
        if (code === 100) {
          window.location.href = PATH.ENROLL;
          // console.error('TO ENROLL');

          return Promise.reject();
        }
        if (code === 101) {
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

        sessionStorage.removeItem('Authorization');
        window.location.href = PATH.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
