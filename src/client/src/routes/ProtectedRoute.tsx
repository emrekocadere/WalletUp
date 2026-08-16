import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Session restoration already happened in AppBootstrap before any route
// rendered, so authChecked is guaranteed true here.
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, onboarding_completed } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
