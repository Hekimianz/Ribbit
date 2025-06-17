import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getSub } from '../../api/subs';
import { Stack, Button } from '@mui/material';
import styles from './Subribbit.module.css';
import HomePost from '../../components/HomePost/HomePost';
export default function Subribbit() {
  const { name } = useParams();
  const [sub, setSub] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSub(name, page, 10);
      if (data) {
        setSub(data.sub);
        setTotalCount(data.totalCount);
      }
    };
    fetchData();
  }, [name, page]);
  console.log(sub.posts);
  const totalPages = Math.ceil(totalCount / 10);
  return (
    <div className={styles.wrapper}>
      <h2>{sub.name}</h2>
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
