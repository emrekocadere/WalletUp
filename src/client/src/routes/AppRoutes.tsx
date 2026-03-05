import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { fetchAppData } from '@/store/slices/appDataSlice';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { AccountsPage } from '@/pages/AccountsPage';
import { AccountDetailPage } from '@/pages/AccountDetailPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { OnboardingPage } from '@/pages/OnboardingPage';

export const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { isLoaded } = useSelector((state: RootState) => state.appData);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const shouldFetchAppData = isAuthenticated || location.pathname === '/onboarding';
    
    if (shouldFetchAppData && !isLoaded) {
      dispatch(fetchAppData());
    }
  }, [dispatch, isLoaded, isAuthenticated, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
      <Route path="/accounts/:id" element={<ProtectedRoute><AccountDetailPage /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
