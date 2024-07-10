import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Switch from 'react-switch';
import classes from './Welcome.module.css';
import ExpenseList from '../Expense/ExpenseList';
import { toggleDarkMode } from '../Expense/themeSlice';
import { logout } from '../Login/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import Login from '../Login/Login';
import { getAuth, signOut } from 'firebase/auth';



const themeReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
  
};

const WelcomeScreen = () => {
  const idToken = useSelector((state) => state.auth.token);
  const [state, dispatch] = useReducer(themeReducer, {
    darkMode: localStorage.getItem('darkMode') === 'true',
  });

  const { darkMode } = state;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    localStorage.setItem('isAuthenticated', 'true');
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    document.documentElement.style.backgroundColor = darkMode ? 'black' : 'white';
    document.documentElement.style.color = darkMode ? 'white' : 'black';
  }, [darkMode]);

  useEffect(() => {
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

    fetchExpenses();
  }, []);

  const handleToggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    localStorage.setItem('darkMode', String(!darkMode));
    dispatchRedux(toggleDarkMode()); 
  };

  const handleDownloadCSV = () => {
    try {
      if (expenses.length === 0) {
        console.warn('No expenses to download.');
        return;
      }
      const modifiedExpensesArray = expenses.map(({ id, name, ...rest }) => rest);
  
      const csvData = Papa.unparse(modifiedExpensesArray);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'expenses.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error during CSV download:', error);
    }
  };
  

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to logout?');
    if (shouldLogout) {
      const auth = getAuth();
      try {
        signOut(auth)
          .then(() => {
            dispatchRedux(logout());
            localStorage.removeItem('isAuthenticated');
            navigate('/login');
            console.log('User logged out successfully');
          })
          .catch((error) => {
            console.error('Error during sign out:', error);
          });
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    }
  };
  const verifyEmailHandler = async () => {
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA-iWDwN9qvPkZ_6bXOw88OOJf6Y5asiwY";
    alert("Please Check your Email");
    try {
      const response = await axios.post(url, {
        requestType: "VERIFY_EMAIL",
        idToken: idToken,
      });

      if (response.status === 200) {
        console.log(response);
      } else {
        console.log("Email not sent");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(false);
    if (isAuthenticated) {
      navigate('/welcome');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div className={classes.welcomeContainer}>
          <div className={classes.toggleButtonContainer}>
            <Switch
              onChange={handleToggleDarkMode}
              checked={darkMode}
              handleDiameter={24}
              onColor="#fff"
              offColor="#1a1a1a"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={40}
              className={`${darkMode ? classes.darkSwitch : classes.lightSwitch}`}
            />
            <span className={`${darkMode ? classes.darkText : classes.lightText} ${classes.toggleButtonText}`}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <button onClick={handleDownloadCSV} className={classes.download}>
              <FontAwesomeIcon icon={faDownload} />
              <FontAwesomeIcon className={classes.csvData} icon={faFileCsv} />
            </button>
            <button className={classes.logout} onClick={handleLogout} >Logout</button>
          </div>
          <h2>Welcome to Expense Tracker!!!</h2>
          <div className={classes.incompleteYour}>
            <p>
              <span>Your Profile is incomplete </span>
              <span className={classes.completeNow}>
                <Link to="/winning-qoute">Complete now</Link>
              </span>
            </p>
          </div>
          <hr />
          <button className={classes.linkButton} onClick={verifyEmailHandler}>
          Verify Email
        </button>
          <ExpenseList expenses={expenses} />
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default WelcomeScreen;