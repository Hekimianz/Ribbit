import { formatDistanceToNow } from 'date-fns';
import { Stack } from '@mui/material';
import { Link } from 'react-router';

import styles from './Comment.module.css';
export default function Comment({
  text,
  author,
  date,
  id,
  score,
  onVote,
  votes,
  disabled,
  userId,
}) {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  const userVote = votes?.find((v) => v.userId === userId);
  const voteValue = userVote?.value;

  return (
    <div className={styles.wrapper}>
      <p>{text}</p>
      <Stack
        className={styles.data}
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{formattedDate}</span>
        {author && <Link to={`/user/${author}`}>by {author}</Link>}
        {!disabled && (
          <Stack direction="row" spacing={0.3}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="16px"
              fill={voteValue === 1 ? '#73B65F' : '#fff'}
              className={styles.upvote}
              onClick={() => onVote(1, id)}
            >
              <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
            </svg>
            <span className={styles.score}>{score}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="16px"
              fill={voteValue === -1 ? '#f53131' : '#fff'}
              className={styles.downvote}
              onClick={() => onVote(-1, id)}
            >
              <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
            </svg>
          </Stack>
        )}
      </Stack>
    </div>
  );
}
