import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.jsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
      <Provider store={store}>
        <App queryClient={queryClient} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
