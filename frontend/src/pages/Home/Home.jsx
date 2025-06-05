import styles from './Home.module.css';
import { Stack } from '@mui/material';
import HomePost from '../../components/HomePost/HomePost';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../../api/posts';

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts();
      if (data) setPosts(data);
    };
    fetchData();
  }, []);
  console.log(posts);
  return (
    <div className="main-wrapper">
      <Stack spacing={2} direction="column">
        {posts.reverse().map((post) => {
          return (
            <HomePost
              key={post.id}
              title={post.title}
              date={post.createdAt}
              author={post.author.username}
              subribbit={post.subribbit.name}
            />
          );
        })}
      </Stack>
    </div>
  );
}
