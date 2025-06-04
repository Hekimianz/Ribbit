import { useState } from 'react';
import styles from '../Register/Register.module.css';
import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
const base_url = import.meta.env.VITE_API_URL;
export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  console.log(user);
  console.log(login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch(`${base_url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (response.ok) {
      navigate('/');
    }
  };
  return (
    <div className="main-wrapper">
      <h1>Login</h1>
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
          >
            Login
          </Button>
        </Stack>
      </form>
    </div>
  );
}
