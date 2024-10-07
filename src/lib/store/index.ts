import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from '@/lib/store/config-redux-persist-store';

import {
    authReducer,
    brandReducer,
    categoryReducer,
    productReducer,
    userReducer,
    notificationReducer,
} from '@/lib/store/slices';
import { deliveryReducer } from '@/lib/store/slices/delivery-slice';

const authPersistConfig = {
    key: 'auth',
    storage: storage,
    whitelist: ['accessToken', 'registerEmail'],
};

const userPersistConfig = {
    key: 'user',
    storage: storage,
    whitelist: [
        'profile',
        'address',
        'historySearch',
        'localSearch',
        'cart',
        'paymentId',
    ],
};

const deliveryPersistConfig = {
    key: 'delivery',
    storage: storage,
    whitelist: ['deliveryList'],
};

const categoryPersistConfig = {
    key: 'category',
    storage: storage,
    whitelist: ['categories'],
};

const brandPersistConfig = {
    key: 'brand',
    storage: storage,
    whitelist: ['brands'],
};

const productPersistConfig = {
    key: 'product',
    storage: storage,
    whitelist: ['products', 'productsSearch'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    user: persistReducer(userPersistConfig, userReducer),
    delivery: persistReducer(deliveryPersistConfig, deliveryReducer),
    category: persistReducer(categoryPersistConfig, categoryReducer),
    brand: persistReducer(brandPersistConfig, brandReducer),
    products: persistReducer(productPersistConfig, productReducer),
    notifications: notificationReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
