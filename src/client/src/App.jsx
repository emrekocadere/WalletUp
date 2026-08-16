import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { setApiClientStore } from './api/client/axios.client';
import { AppRoutes } from './routes/AppRoutes';
import { initAuth } from './store/slices/authSlice';
import './App.css';

setApiClientStore(store); // does it work without this

const queryClient = new QueryClient();

// Tries to silently restore the session from the refreshToken cookie before
// any route renders, so a closed browser / F5 reload never bounces the user
// to /login while their refresh token is still valid.
function AppBootstrap() {
  const dispatch = useDispatch();
  const authChecked = useSelector((state) => state.auth.authChecked);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1224]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>

        <BrowserRouter>
          <AppBootstrap />
        </BrowserRouter>

    </Provider>
  );
}

export default App;
