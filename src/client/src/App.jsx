import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { setApiClientStore } from './api/client/axios.client';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

setApiClientStore(store); // does it work without this

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>

        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>

    </Provider>
  );
}

export default App;
