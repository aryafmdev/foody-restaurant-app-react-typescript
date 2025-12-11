import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type AuthUser = {
  id: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type AuthState = {
  token: string | null;
  userId: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  token: null,
  userId: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUserId(state, action: PayloadAction<string | null>) {
      state.userId = action.payload;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
  },
});

export const { setToken, setUserId, setUser } = authSlice.actions;
export default authSlice.reducer;
