import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getSub } from '../../api/subs';
import { Stack } from '@mui/material';
import styles from './Subribbit.module.css';
import HomePost from '../../components/HomePost/HomePost';
export default function Subribbit() {
  const { name } = useParams();
  const [sub, setSub] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSub(name);
      if (data) setSub(data);
    };
    fetchData();
  }, [name]);
  return (
    <div className={styles.wrapper}>
      <h2>{sub.name}</h2>
      <p>{sub.description}</p>
      <hr />
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
            />
          );
        })}
      </Stack>
    </div>
  );
}
