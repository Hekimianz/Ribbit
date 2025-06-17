import { useState, useEffect } from 'react';
import styles from './Register.module.css';
import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(true);
  const [passDontMatch, setPassDontMatch] = useState(false);

  useEffect(() => {
    if (!username || !password) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [username, password]);

  useEffect(() => {
    if (password !== confPassword) {
      setPassDontMatch(true);
    } else {
      setPassDontMatch(false);
    }
  }, [confPassword, password]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    const errorMessage = await register(username, password);
    if (errorMessage) {
      setErrors([errorMessage]);
    } else {
      navigate('/login');
    }
    setLoading(false);
  };
  return (
    <div className="main-wrapper">
      {loading && <div className={styles.loader}></div>}
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((error, i) => {
            return <li key={i}>{error}</li>;
          })}
        </ul>
      )}
      <form className={styles.form} method="POST" onSubmit={handleRegister}>
        <Stack spacing={1} direction="column">
          <h1>Create Account</h1>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="confPassword">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confPassword"
            id="confPassword"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="btn"
            variant="contained"
            color="customBtn"
            disabled={invalid || passDontMatch}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: '#ccc',
                color: '#666',
                cursor: 'not-allowed',
                boxShadow: 'none',
                marginTop: '3rem',
              },
            }}
          >
            Register
          </Button>
        </Stack>
      </form>
      {passDontMatch && (
        <span className={styles.error}>Passwords dont match!</span>
      )}
    </div>
  );
}
