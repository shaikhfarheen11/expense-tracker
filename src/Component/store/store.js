
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Login/authSlice';
import expensesReducer from '../Expense/expensesSlice';
import themeReducer from '../Expense/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer, 
    theme: themeReducer, 
    
  },
});

export default store;
