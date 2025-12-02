'use client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import Loading from './Loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

 const queryClient = new QueryClient();

const GlobalProvider = ({ children }) => {

  return (
          <QueryClientProvider client={queryClient}>
              <Provider store={ store }> 
                <PersistGate persistor={persistor} loading={<Loading />}>
                  { children }
                </PersistGate>
              </Provider>
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
            </Suspense>
          </QueryClientProvider>
  )
}

export default GlobalProvider;
