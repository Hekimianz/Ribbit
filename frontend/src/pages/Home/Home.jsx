import styles from './Home.module.css';
import { Stack, Button } from '@mui/material';
import HomePost from '../../components/HomePost/HomePost';
import { useEffect, useState } from 'react';
import { vote, getPostsFromSubs } from '../../api/posts';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const postsPerPage = 10;
  const totalPages = Math.ceil(totalCount / postsPerPage);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/all');
      return;
    }

    const fetchData = async () => {
      const data = await getPostsFromSubs(user.username, page, postsPerPage);
      if (data) {
        setPosts(data.posts);
        setTotalCount(data.totalCount);
      }
    };
    fetchData();
  }, [user, loading, navigate, page]);

  const handlePostVote = async (value, postId, userId) => {
    await vote(value, postId);

    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const existingVote = post.votes.find((v) => v.userId === userId);
          let updatedVotes;

          if (!existingVote) {
            updatedVotes = [...post.votes, { userId, value }];
          } else if (existingVote.value === value) {
            updatedVotes = post.votes.filter((v) => v.userId !== userId);
          } else {
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
        <h1 className={styles.title}>Posts from Subscriptions</h1>
        {posts.length === 0 && <p>You haven't subscribed to any subRibbits!</p>}
        {posts.map((post) => (
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
        ))}
      </Stack>

      <Stack
        direction="row"
        className={styles.pageBtns}
        sx={{ marginTop: '5rem' }}
      >
        {page > 1 && (
          <Button variant="text" onClick={() => setPage((prev) => prev - 1)}>
            {page - 1}
          </Button>
        )}
        <Button sx={{ textDecoration: 'underline' }} disabled variant="text">
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
