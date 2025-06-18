import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  getSub,
  subscribeToSub,
  getSubscriptions,
  unsubscribeFromSub,
} from '../../api/subs';
import { Stack, Button } from '@mui/material';
import styles from './Subribbit.module.css';
import HomePost from '../../components/HomePost/HomePost';
import { useAuth } from '../../context/authContext';
export default function Subribbit() {
  const { name } = useParams();
  const { user } = useAuth();
  const [sub, setSub] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSub(name, page, 10);
      if (data) {
        setSub(data.sub);
        setTotalCount(data.totalCount);
      }
      setSubscriptions(await getSubscriptions());
    };
    fetchData();
  }, [name, page]);

  const isSubscribed = sub.name && subscriptions.includes(sub.name);

  const totalPages = Math.ceil(totalCount / 10);
  return (
    <div className={styles.wrapper}>
      <Stack direction="row" spacing={2}>
        <h2>{sub.name}</h2>
        {user && (
          <Button
            onClick={async () => {
              if (isSubscribed) {
                await unsubscribeFromSub(sub.name);
              } else {
                await subscribeToSub(sub.name);
              }
              const updatedSubs = await getSubscriptions();
              setSubscriptions([...updatedSubs]); // force array ref to change
            }}
            color="customBtn"
            variant="contained"
            sx={{
              background: isSubscribed && '#fc6b6b',
            }}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </Button>
        )}
      </Stack>
      <p>{sub.description}</p>

      <h3>Posts</h3>
      <Stack spacing={2} className={styles.posts}>
        {sub?.posts?.map((post) => {
          return (
            <HomePost
              key={post.id}
              title={post.title}
              date={post.createdAt}
              author={post.author.username}
              id={post.id}
              subribbit={sub.name}
              img={post.image}
            />
          );
        })}
      </Stack>
      <Stack
        direction="row"
        className={styles.pageBtns}
        sx={{
          marginTop: '5rem',
        }}
      >
        {page > 1 && (
          <Button variant="text" onClick={() => setPage((prev) => prev - 1)}>
            {page - 1}
          </Button>
        )}
        <Button
          sx={{ textDecoration: 'underline' }}
          disabled={true}
          variant="text"
        >
          {page}
        </Button>
        {page < totalPages && (
          <Button variant="text" onClick={() => setPage((prev) => prev + 1)}>
            {page + 1}
          </Button>
        )}
      </Stack>
    </div>
  );
}
