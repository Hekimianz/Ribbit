import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './Register.module.css';
import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(true);

  useEffect(() => {
    if (!username || !password) {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    const errorMessage = await register(username, password);
    if (errorMessage) {
      console.log(errorMessage);
      setErrors([errorMessage]);
    } else {
      navigate('/login');
    }
    setLoading(false);
  };
  return (
    <div className="main-wrapper">
      <h1>Register</h1>
      {loading && <div className={styles.loader}></div>}
      {errors.length > 0 && (
        <ul className={styles.errors}>
          {errors.map((error) => {
            return <li>{error}</li>;
          })}
        </ul>
      )}
      <form className={styles.form} method="POST" onSubmit={handleRegister}>
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
            Register
          </Button>
          <Link to="/">Go back home</Link>
        </Stack>
      </form>
    </div>
  );
}
