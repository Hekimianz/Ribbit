import { Stack } from '@mui/material';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import styles from './HomePost.module.css';
export default function HomePost({ title, date, author, subribbit, id, img }) {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  console.log(img);
  return (
    <Stack
      className={styles.post}
      direction="column"
      sx={{
        alignItems: 'flex-start',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        {img ? (
          <img className={styles.thumbnail} alt="thumbnail" src={img} />
        ) : (
          <div className={styles.thumbnail}></div>
        )}
        <Link to={`/posts/${id}`} className={styles.title}>
          {title}
        </Link>
      </Stack>
      <Stack
        sx={{
          marginLeft: '100px',
        }}
        spacing={0.5}
        direction="row"
      >
        <span className={styles.date}>{formattedDate} |</span>
        <Link to={`/user/${author}`} className={styles.author}>
          by {author} |
        </Link>
        <Link to={`/subribbits/${subribbit}`} className={styles.subribbit}>
          r/{subribbit}
        </Link>
      </Stack>
    </Stack>
  );
}
