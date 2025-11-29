'use client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import Loading from './Loading';

const GlobalProvider = ({ children }) => {
  return (
          <Provider store={ store }> 
            <PersistGate persistor={persistor} loading={<Loading />}>
              { children }
            </PersistGate>
          </Provider>
  )
}

export default GlobalProvider;
