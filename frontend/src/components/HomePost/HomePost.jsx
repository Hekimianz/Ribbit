import { useState } from 'react';
import { Stack, Skeleton } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import styles from './HomePost.module.css';
import { useAuth } from '../../context/authContext';

export default function HomePost({
  title,
  date,
  author,
  subribbit,
  id,
  img,
  votes,
  onVote,
}) {
  const { user } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  const userVote = votes?.find((v) => v.userId === user.id);
  const voteValue = userVote?.value;

  return (
    <Stack
      className={styles.post}
      direction="column"
      sx={{
        alignItems: 'flex-start',
      }}
      onClick={() => {
        navigate(`/posts/${id}`);
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
      >
        {img ? (
          <div className={styles.thumbnailWrapper}>
            {!imgLoaded && (
              <Skeleton
                variant="rectangular"
                width={70}
                height={70}
                sx={{
                  borderRadius: '4px',
                  margin: '1rem',
                }}
              />
            )}
            <img
              className={`${styles.thumbnail} ${
                imgLoaded ? styles.loaded : ''
              }`}
              alt="thumbnail"
              src={img}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
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
          width: '100%',
        }}
        spacing={0.5}
        direction="row"
      >
        <span className={styles.date}>{formattedDate} |</span>
        <Link
          to={`/user/${author}`}
          onClick={(e) => e.stopPropagation()}
          className={styles.author}
        >
          by {author} |
        </Link>
        <Link
          to={`/subribbits/${subribbit}`}
          onClick={(e) => e.stopPropagation()}
          className={styles.subribbit}
        >
          r/{subribbit}
        </Link>
        <Stack direction="row" id={styles.votes} spacing={0.5}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            className={styles.upvote}
            fill={voteValue === 1 ? '#73B65F' : '#000'}
            onClick={(e) => {
              e.stopPropagation();
              onVote(1, id, user.id);
            }}
          >
            <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
          </svg>
          <span>{votes?.reduce((acc, v) => acc + v.value, 0)}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            className={styles.downvote}
            fill={voteValue === -1 ? '#f53131' : '#000'}
            onClick={(e) => {
              e.stopPropagation();
              onVote(-1, id, user.id);
            }}
          >
            <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
          </svg>
        </Stack>
      </Stack>
    </Stack>
  );
}
