import { configureStore } from '@reduxjs/toolkit';

import { setAuthToken } from '../api/client';
import { persistSession } from './authStorage';
import { authReducer } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

let previousToken: string | null = null;
store.subscribe(() => {
  const { token, tokenType, user } = store.getState().auth;
  setAuthToken(token);

  if (token && token !== previousToken && user) {
    persistSession({ token, tokenType, user });
  }
  previousToken = token;
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
