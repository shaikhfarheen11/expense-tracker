import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  totalAmount: 0,
  showPremiumButton: false,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action) {
      const newExpense = action.payload;
      state.expenses.push(newExpense);
      state.totalAmount += parseFloat(newExpense.amount);
      state.showPremiumButton = state.totalAmount > 10000;
    },
    deleteExpense(state, action) {
      const expenseId = action.payload;
      const deletedExpense = state.expenses.find((expense) => expense.id === expenseId);

      if (deletedExpense) {
        state.totalAmount -= parseFloat(deletedExpense.amount);
        state.expenses = state.expenses.filter((expense) => expense.id !== expenseId);
      }

      state.showPremiumButton = state.totalAmount > 10000;
    },
    setPremiumButton(state, action) {
      state.showPremiumButton = action.payload;
    },
  },
});

export const { addExpense, deleteExpense, setPremiumButton } = expensesSlice.actions;
export default expensesSlice.reducer;