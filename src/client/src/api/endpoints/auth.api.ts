import { apiClient } from '../client/axios.client';
import type { LoginRequest, RegisterRequest, AuthResponse, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest } from '@/types/auth.types';
import type { ResultT, Result } from '@/types/common.types';
import axios from 'axios';

const toFailure = (error: unknown, id: string, fallback: string): Result => {
  if (axios.isAxiosError(error)) {
    return {
      isSuccess: false,
      error: {
        id,
        description: error.response?.data?.error?.description || fallback,
      },
    };
  }
  throw error;
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ResultT<AuthResponse>> => {
    try {
      const { data } = await apiClient.post<ResultT<AuthResponse>>('/Identity/login', credentials);
      return data;
    } catch (error) {
      // Check if error has statusCode (from axios interceptor)
      const apiError = error as any;

      if (apiError.statusCode === 401) {
        return {
          isSuccess: false,
          error: {
            id: 'IncorrectPassword',
            description: 'Incorrect email or password. Please try again.'
          }
        };
      }

      if (apiError.statusCode === 0) {
        // Network error
        return {
          isSuccess: false,
          error: {
            id: 'NetworkError',
            description: 'Network error. Please check your connection and try again.'
          }
        };
      }

      // Other errors
      return {
        isSuccess: false,
        error: {
          id: 'LoginFailed',
          description: apiError.message || 'Login failed. Please try again later.'
        }
      };
    }
  },

  register: async (userData: RegisterRequest): Promise<ResultT<AuthResponse>> => {
    try {
      const { data } = await apiClient.post<ResultT<AuthResponse>>('/Identity/register', userData);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          isSuccess: false,
          error: {
            id: 'RegistrationFailed',
            description: error.response?.data?.error?.description || 'Kayıt başarısız. Lütfen daha sonra tekrar deneyin.'
          }
        };
      }

      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/Identity/logout');
  },

  deleteAccount: async (): Promise<Result> => {
    const { data } = await apiClient.delete<Result>('/Identity');
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<Result> => {
    try {
      const { data } = await apiClient.post<Result>('/Identity/forgot-password', payload);
      return data;
    } catch (error) {
      return toFailure(error, 'ForgotPasswordFailed', 'Failed to send reset code. Please try again.');
    }
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<Result> => {
    try {
      const { data } = await apiClient.post<Result>('/Identity/verify-otp', payload);
      return data;
    } catch (error) {
      return toFailure(error, 'VerifyOtpFailed', 'Failed to verify code. Please try again.');
    }
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<Result> => {
    try {
      const { data } = await apiClient.post<Result>('/Identity/reset-password', payload);
      return data;
    } catch (error) {
      return toFailure(error, 'ResetPasswordFailed', 'Failed to reset password. Please try again.');
    }
  },
};
