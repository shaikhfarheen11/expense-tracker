import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  token: localStorage.getItem('authToken') || null,
  userId: localStorage.getItem('userId') || null,
  loginError: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.loginError = null; 
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      state.loginError = null; 
    },
    setLoginError(state, action) {
      state.loginError = action.payload; 
    },
  },
});

export const { login, logout, setLoginError } = authSlice.actions;

export default authSlice.reducer;
