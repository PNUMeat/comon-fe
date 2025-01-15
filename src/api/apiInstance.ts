import { handleCookieOnRedirect } from '@/utils/cookie';

import { NavigateFunction } from 'react-router-dom';

import { ServerIntendedError } from '@/api/types';
import { PATH } from '@/routes/path';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

interface FailedRequest {
  resolve: (
    value: Promise<AxiosResponse<unknown>> | PromiseLike<AxiosResponse<unknown>>
  ) => void;
  reject: (error: AxiosError<unknown, unknown>) => void;
  config: AxiosRequestConfig;
}

let navigator: NavigateFunction | null = null;
let isReissuing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(axios(prom.config));
    }
  });

  failedQueue = [];
};
export const setNavigator = (nav: NavigateFunction) => {
  navigator = nav;
};

export const navigate = (path: string) => {
  if (navigator) {
    navigator(path);
  }
};

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
    /**
     * 응답이 401이고, 401의 원인이 access token이 만료된 경우,
     * refresh token을 통해 access token을 재발급 받은후,
     * 재발급한 access token을 통해 재요청한다.
     * access token을 재발급 받을 때, "이전 로그인 정보를 통해 재입장중입니다."라는 느낌의 토스트 메세지를 띄웠으면 좋겠음
     * 대기시간이 길어지는 이유를 설명하고 싶음.
     */
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response) {
      const data = error.response.data;
      const { code } = data;
      if (error.response.status === 401) {
        if (code === 100) {
          navigate(PATH.ENROLL);

          return Promise.reject(error);
        }

        if (code === 101) {
          if (isReissuing) {
            return new Promise<AxiosResponse>((resolve, reject) => {
              failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          isReissuing = true;

          return apiInstance
            .post('v1/reissue')
            .then(() => {
              handleCookieOnRedirect();

              processQueue(null);
              return apiInstance(originalRequest);
            })
            .catch((reissueError: AxiosError) => {
              processQueue(reissueError);
              sessionStorage.removeItem('Authorization');
              navigate(PATH.LOGIN);

              console.error('reissue error', reissueError);
              return Promise.reject(reissueError);
            })
            .finally(() => {
              isReissuing = false;
            });
        }

        // 리프레시 토큰이 만료됨
        sessionStorage.removeItem('Authorization');
        navigate(PATH.LOGIN);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
