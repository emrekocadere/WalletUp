import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { User } from '@/types/auth.types';
import type { ResultT } from '@/types/common.types';
import type { AuthResponse } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5039/api';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  onboarding_completed: boolean;
  authChecked: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  onboarding_completed: false,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; isOnboardingCompleted: boolean; }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.onboarding_completed = action.payload.isOnboardingCompleted;
      authService.setAccessToken(action.payload.accessToken);
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.onboarding_completed = false;

      authService.clearAccessToken();
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboarding_completed = action.payload;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const { setCredentials, logout, setOnboardingCompleted, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;

// Thunk: uygulama açılırken cookie'deki refresh token ile oturum yenilemeyi dener.
// Başarılıysa accessToken set edilir, başarısızsa authChecked = true yapılır ve /login'e yönlendirme ProtectedRoute tarafından yapılır.
export const initAuth = createAsyncThunk('auth/initAuth', async (_, { dispatch }) => {
  try {
    const response = await axios.post<ResultT<AuthResponse>>(
      `${baseURL}/Identity/refresh`,
      {},
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = response.data;
    if (data.isSuccess && data.value?.accessToken) {
      dispatch(setCredentials({ accessToken: data.value.accessToken, isOnboardingCompleted: data.value.isOnboardingCompleted ?? false }));
    }
  } catch {
    // Refresh başarısız — kullanıcı giriş yapmamış
  } finally {
    dispatch(setAuthChecked());
  }
});
