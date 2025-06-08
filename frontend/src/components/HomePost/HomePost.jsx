import { Stack } from '@mui/material';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import styles from './HomePost.module.css';
export default function HomePost({ title, date, author, subribbit, id }) {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  return (
    <div className={styles.post}>
      <Link to={`/posts/${id}`} className={styles.title}>
        {title}
      </Link>
      <Stack spacing={0.5} direction="row">
        <span className={styles.date}>{formattedDate} |</span>
        <Link to={`/user/${author}`} className={styles.author}>
          by {author} |
        </Link>
        <Link to={`/subribbits/${subribbit}`} className={styles.subribbit}>
          r/{subribbit}
        </Link>
      </Stack>
    </div>
  );
}
