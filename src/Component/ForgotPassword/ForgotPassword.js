import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA-iWDwN9qvPkZ_6bXOw88OOJf6Y5asiwY';

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email,
          requestType: 'PASSWORD_RESET',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setResetSent(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['forgot-password-container']}>
      <div className={styles['forgot-password-content']}>
        {resetSent ? (
          <div>
            <p className={styles['success-message']}>
              Password reset link sent to your email. Check your inbox and follow the instructions.
            </p>
            <Link to="/login" className={styles['forgot-password-link']}>
              Go back to login
            </Link>
          </div>
        ) : (
          <form className={styles['forgot-password-form']} onSubmit={handleForgotPassword}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="email">Enter the email which you have registered</label>
              <input
                type="email"z
                id="email"
                className={styles['forgot-password-input']}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles['error-message']}>{error}</p>}
            <button
              className={styles['forgot-password-button']}
              disabled={loading}
            >
              {loading ? 'Sending Reset Email...' : 'Send Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
