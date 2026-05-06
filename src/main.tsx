import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/reset.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';

import './main.css';
import { registerAppServiceWorker } from '@/workers/registerServiceWorker';

const queryClient = new QueryClient();
registerAppServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
