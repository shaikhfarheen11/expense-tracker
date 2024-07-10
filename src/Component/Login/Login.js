import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux'; 
import classes from './Login.module.css';
import { login } from './authSlice';


const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-iWDwN9qvPkZ_6bXOw88OOJf6Y5asiwY';

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.idToken;
        const userId = data.localId;

        dispatch(login({ token, userId })); 
        
        console.log('User has successfully logged in. Token:', token);
        navigate('/welcome');  
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      setLoginError(error.message);
    }
  };

  return (
    <div className={classes.signupContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={classes.passwordContainer}>
          <label htmlFor="password">Password:</label>
          <div className={classes.passwordInput}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className={classes.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>
        {loginError && <p className={classes.errorMessage}>{loginError}</p>}
        <button type='submit' className={classes.submit}>Login</button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;