import { formatDistanceToNow } from 'date-fns';
import { Stack } from '@mui/material';
import { Link } from 'react-router';
import styles from './Comment.module.css';
export default function Comment({ text, author, date }) {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  return (
    <div className={styles.wrapper}>
      <p>{text}</p>
      <Stack className={styles.data} direction="row">
        <span>{formattedDate}</span>
        {author && <Link to={`/user/${author}`}>by {author}</Link>}
      </Stack>
    </div>
  );
}
