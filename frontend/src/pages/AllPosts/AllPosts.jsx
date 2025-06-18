import styles from '../Home/Home.module.css';
import { Stack, Button } from '@mui/material';
import HomePost from '../../components/HomePost/HomePost';
import { useEffect, useState } from 'react';
import { getAllPosts, vote } from '../../api/posts';
import { useSearchParams } from 'react-router';
import { useAuth } from '../../context/authContext';

export default function AllPosts() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const search = searchParams.get('search') || undefined;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts(page, 10, search);
      if (data) {
        setPosts(data.posts);
        setTotalCount(data.totalCount);
      }
    };
    fetchData();
  }, [page, search, user]);
  const totalPages = Math.ceil(totalCount / 10);

  const handlePostVote = async (value, postId, userId) => {
    await vote(value, postId);

    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const existingVote = post.votes.find((v) => v.userId === userId);
          let updatedVotes;

          if (!existingVote) {
            // Add new vote
            updatedVotes = [...post.votes, { userId, value }];
          } else if (existingVote.value === value) {
            // Remove vote (toggle off)
            updatedVotes = post.votes.filter((v) => v.userId !== userId);
          } else {
            // Change vote
            updatedVotes = post.votes.map((v) =>
              v.userId === userId ? { ...v, value } : v
            );
          }

          return { ...post, votes: updatedVotes };
        }

        return post;
      });
    });
  };

  return (
    <div className="main-wrapper">
      <Stack spacing={2} direction="column">
        <h1 className={styles.title}>All Posts</h1>
        {posts.map((post) => {
          return (
            <HomePost
              key={post.id}
              title={post.title}
              date={post.createdAt}
              author={post.author.username}
              subribbit={post.subribbit.name}
              id={post.id}
              img={post.image}
              votes={post.votes}
              onVote={handlePostVote}
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
