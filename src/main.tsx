import { isDevMode } from '@/utils/cookie.ts';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from '@/routes/router';
import '@/styles/reset.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './main.css';

const registerFileCacheWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        isDevMode() ? 'src/workers/cacheWorker.ts' : '/sw.js',
        {
          type: 'module',
        }
      );
      console.log(
        'FileCacher ServiceWorker registration successful:',
        registration
      );
    } catch (error) {
      console.log('FileCacher ServiceWorker registration failed:', error);
    }
  }
};

const queryClient = new QueryClient();
registerFileCacheWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
