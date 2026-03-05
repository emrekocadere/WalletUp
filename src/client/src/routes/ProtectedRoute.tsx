import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { initAuth } from '@/store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, authChecked, onboarding_completed } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!authChecked) {
      dispatch(initAuth());
    }
  }, [dispatch, authChecked]);

  // Refresh tamamlanana kadar bekle
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Refresh tamamlandı ama oturum yoksa login'e at
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Onboarding tamamlanmadıysa onboarding'e yönlendir
  if (!onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
