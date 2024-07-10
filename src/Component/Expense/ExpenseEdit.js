import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExpenseEdit.module.css';

const ExpenseEdit = ({ id }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryStyle, setSelectedCategoryStyle] = useState({});

  useEffect(() => {
    const fetchedCategories = ['Food', 'Petrol', 'Salary', 'T-shirts'];
    setCategories(fetchedCategories);
  }, []);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`https://react-hp-325a3-default-rtdb.firebaseio.com/expenses/${id}.json`);
        const data = await response.json();
        if (data) {
          setAmount(data.amount);
          setDescription(data.description);
          setCategory(data.category);
        }
      } catch (error) {
        console.error('Error fetching expense:', error.message);
      }
    };

    fetchExpense();
  }, [id]);

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const updatedExpense = { amount, description, category };

    try {
      const response = await fetch(`https://react-hp-325a3-default-rtdb.firebaseio.com/expenses/${id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedExpense),
      });

      if (response.ok) {
        console.log('Expense successfully updated');
        navigate('/welcome');
      } else {
        console.error('Failed to update expense. Server response:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating expense:', error.message);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    const borderStyle = selectedCategory ? { border: '2px solid green' } : {};
    setSelectedCategoryStyle(borderStyle);
  };

  return (
    <div className={styles.container}>
      <h2>Edit Expense</h2>
      <form onSubmit={handleEditSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '93%', padding: '8px', fontSize: '16px', border: '1px solid #111010', borderRadius: '4px' }}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '93%', padding: '8px', fontSize: '16px', border: '1px solid #111010', borderRadius: '4px' }}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category:</label>
          <select
            className={styles.selectField}
            value={category}
            onChange={handleCategoryChange}
            style={selectedCategoryStyle}
            id="category"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExpenseEdit;     