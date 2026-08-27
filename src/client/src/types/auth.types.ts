export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}




export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  surname: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  isOnboardingCompleted: boolean;
}

export interface TokenPayload {
  userId: string;
  email: string;
  exp: number;
  iat: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}
