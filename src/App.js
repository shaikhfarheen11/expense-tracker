import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Component/Signup/Signup';
import Login from './Component/Login/Login';
import WelcomeScreen from './Component/WelcomeScreen/WelcomeScreen';
import { AuthContextProvider } from './Component/AuthContext/AuthContext';
import WinningQuote from './Component/WelcomeScreen/WinningQoute';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import ExpenseForm from './Component/Expense/ExpenseForm';
import ExpenseList from './Component/Expense/ExpenseList';
import ExpenseEdit from './Component/Expense/ExpenseEdit';
import './App.css';


function App() {
  return (
    
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/winning-qoute" element={<WinningQuote />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/expense-form" element={<ExpenseForm />} />
          <Route path="/welcome" element={<ExpenseList />} />
          <Route path="/edit-expense/:id" element={<ExpenseEdit />} />
 </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;