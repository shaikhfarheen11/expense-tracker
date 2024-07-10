import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', String(state.darkMode));
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export const selectDarkMode = (state) => state.theme.darkMode;
export default themeSlice.reducer;