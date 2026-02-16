import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ResultT } from '@/types/common.types';
import type { AuthResponse } from '@/types/auth.types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5039/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

let store: any = null;

// Function to set the store
export const setApiClientStore = (reduxStore: any) => {
  store = reduxStore;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (store) {
      const token = store.getState().auth.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (!store) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const publicEndpoints = [
      '/Identity/login',
      '/Identity/register',
      '/Identity/refresh',
      '/Transaction/Currencies',
      '/Transaction/categories',
      '/Transaction/types'
    ];
    const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
      originalRequest._retry = true;

      try {
        // Use new axios instance for refresh request (without interceptors)
        const refreshResponse = await axios.post<ResultT<AuthResponse>>(
          `${baseURL}/Identity/refresh`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        const data = refreshResponse.data;
        
        if (data.isSuccess && data.value?.accessToken) {
          const { setCredentials } = await import('@/store/slices/authSlice');
          store.dispatch(setCredentials({ accessToken: data.value.accessToken }));
          
          originalRequest.headers!.Authorization = `Bearer ${data.value.accessToken}`;
          return apiClient(originalRequest);
        } else {
          // Refresh failed
          const { logout } = await import('@/store/slices/authSlice');
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh request failed
        const { logout } = await import('@/store/slices/authSlice');
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        errors: error.response.data?.errors,
        statusCode: error.response.status,
      } as ApiError);
    } else if (error.request) {
      return Promise.reject({
        message: 'Network error',
        statusCode: 0,
      } as ApiError);
    }
    return Promise.reject(error);
  }
);