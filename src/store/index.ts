import { configureStore } from '@reduxjs/toolkit';
import heroReducer from '@/store/slices/heroSlice';
import aboutReducer from '@/store/slices/aboutSlice';
import servicesReducer from '@/store/slices/servicesSlice';
import faqReducer from '@/store/slices/faqSlice';
import contactReducer from '@/store/slices/contactSlice';
import uiReducer from '@/store/slices/uiSlice';
import productsReducer from '@/store/slices/productsSlice';
import categoriesReducer from '@/store/slices/categoriesSlice';
import postsReducer from '@/store/slices/postsSlice';
import empresaReducer from '@/store/slices/empresaSlice';

export const store = configureStore({
  reducer: {
    hero: heroReducer,
    about: aboutReducer,
    services: servicesReducer,
    faq: faqReducer,
    contact: contactReducer,
    ui: uiReducer,
    products: productsReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    empresa: empresaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
