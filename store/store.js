import { combineReducers, configureStore } from '@reduxjs/toolkit';
import localStorage from 'redux-persist/es/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import authReducer from '@/store/reducer/authReducer';
import selectedMediaReducer  from './reducer/selecetedMediaReducer';
import cartReducer  from './reducer/cartReducer';

const rootReducer = combineReducers({
    authStore: authReducer,
    selectedMediaStore: selectedMediaReducer,
    cartStore : cartReducer

});

const persistConfig = {
    key: 'root',
    storage: localStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware( { serializableCheck: false}) 
});

export const persistor = persistStore(store);
