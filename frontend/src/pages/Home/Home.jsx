import styles from './Home.module.css';
import { Link } from 'react-router';
import { Button, Stack } from '@mui/material';

export default function Home() {
  return (
    <div className="main-wrapper">
      <h1 className={styles.title}>🐸 Ribbit</h1>
      <p className={styles.subtitle}>
        A place to dive into real conversations. No filters. No algorithms
        telling you what to like.
      </p>
      <h2 className={styles.subtitle}>Ready to jump in?</h2>
      <Stack className={styles.buttons} spacing={2} direction="row">
        <Link to="/register">
          <Button variant="contained" color="customBtn">
            Register
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="contained" color="customBtn">
            Sign In
          </Button>
        </Link>
      </Stack>
    </div>
  );
}
