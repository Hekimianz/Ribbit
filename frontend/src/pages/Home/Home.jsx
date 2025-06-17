import styles from './Home.module.css';
import { Stack, Button } from '@mui/material';
import HomePost from '../../components/HomePost/HomePost';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../../api/posts';

export default function Home() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts(page, 10);
      if (data) {
        setPosts(data.posts);
        setTotalCount(data.totalCount);
      }
    };
    fetchData();
  }, [page]);
  const totalPages = Math.ceil(totalCount / 10);
  console.log(posts);

  return (
    <div className="main-wrapper">
      <Stack spacing={2} direction="column">
        <h1 className={styles.title}>All Posts</h1>
        {posts.reverse().map((post) => {
          return (
            <HomePost
              key={post.id}
              title={post.title}
              date={post.createdAt}
              author={post.author.username}
              subribbit={post.subribbit.name}
              id={post.id}
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
