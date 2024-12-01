import axios, { AxiosInstance } from 'axios';

const apiInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/`,
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
    return Promise.reject(error);
  }
);

export default apiInstance;
