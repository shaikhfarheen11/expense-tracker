import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {deleteExpense, setPremiumButton } from './expensesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import styles from './ExpenseList.module.css';
import ExpenseForm from './ExpenseForm';



const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editedExpenseId, setEditedExpenseId] = useState(null);


  const dispatch = useDispatch();
  const showPremiumButton = useSelector((state) => state.expenses?.showPremiumButton);
  const darkMode = useSelector((state) => state.theme.darkMode);


  useEffect(() => {

    const savedShowPremiumButton = JSON.parse(localStorage.getItem('showPremiumButton'));
    if (savedShowPremiumButton !== null) {
      dispatch(setPremiumButton(savedShowPremiumButton));
    }

    fetchExpenses();
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.toggle('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    console.log("Total Amount:", totalAmount);
    const showPremium = totalAmount > 10000;
    dispatch(setPremiumButton(showPremium));
  }, [expenses, dispatch]);
  


  useEffect(() => {
  localStorage.setItem('showPremiumButton', JSON.stringify(showPremiumButton));
  }, [showPremiumButton, dispatch]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('https://react-hp-325a3-default-rtdb.firebaseio.com/expenses.json');
      const data = await response.json();

      if (data) {
        const expensesArray = Object.entries(data).map(([id, expense]) => ({ id, ...expense }));
        setExpenses(expensesArray);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
    }
  };

  
  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };
  

  useEffect(() => {
    if (editedExpenseId) {
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== editedExpenseId));
      setEditedExpenseId(null);
    }
  }, [editedExpenseId]);
  
  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`https://react-hp-325a3-default-rtdb.firebaseio.com/expenses/${id}.json`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Expense successfully deleted');
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
        dispatch(deleteExpense(id));
      } else {
        console.error('Failed to delete expense. Server response:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting expense:', error.message);
    }
  };
  
 
  

  const handleActivatePremium = () => {
    dispatch(setPremiumButton(true));
  };

  return (
    <div>
      <ExpenseForm onAddExpense={handleAddExpense} />
      <div>
        <h2 className={styles.expenseList}>Expenses List</h2>
        {showPremiumButton && (
            <button className={styles.activatePremium} onClick={handleActivatePremium}>
              <FontAwesomeIcon icon={faStar} style={{ marginRight: '8px' }} />
              Premium
            </button>
          )}

        <ul>
          {expenses.map((expense, index) => (
            <li key={index} className={styles.expenseItem}>
              <span className={styles.amount}>{expense.amount}</span> -
              <span className={styles.description}> {expense.description}</span>
              <span className={styles.category}>({expense.category})</span>
              <button className={styles.delete} onClick={() => handleDeleteExpense(expense.id)}>
                Delete
              </button>
              <Link to={`/edit-expense/${expense.id}`}>
                <button className={styles.edit}>Edit</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseList;                                                                                                                         