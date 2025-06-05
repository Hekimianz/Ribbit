import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from '../Register/Register.module.css';
import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!password || !username) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [username, password]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    const errorMessage = await login(username, password);
    if (errorMessage) {
      console.log(errorMessage);
      setErrors([errorMessage]);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="main-wrapper">
      <h1>Login</h1>
      {loading && <div className={styles.loader}></div>}
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((error) => {
            return <li>{error}</li>;
          })}
        </ul>
      )}
      <form className={styles.form} method="POST" onSubmit={handleLogin}>
        <Stack spacing={1} direction="column">
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
          <Button
            type="submit"
            className="btn"
            variant="contained"
            color="customBtn"
            disabled={invalid}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: '#ccc',
                color: '#666',
                cursor: 'not-allowed',

                boxShadow: 'none',
              },
            }}
          >
            Login
          </Button>
          <Link to="/">Go back home</Link>
        </Stack>
      </form>
    </div>
  );
}
