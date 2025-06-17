import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getUsersPosts, vote } from '../../api/posts';
import { getUsersComments } from '../../api/comments';
import { Stack } from '@mui/material';
import { Link } from 'react-router';

import styles from './User.module.css';
import HomePost from '../../components/HomePost/HomePost';
import Comment from '../../components/Comment/Comment';

export default function User() {
  const { name } = useParams();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  console.log(posts);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersPosts(name);
      if (data) setPosts(data);
    };
    fetchData();
  }, [name]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersComments(name);
      if (data) setComments(data.comments);
    };
    fetchData();
  }, [name]);

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
    <Stack
      direction="column"
      spacing={3}
      sx={{
        alignItems: 'center',
      }}
    >
      <h1 className={styles.title}>{name[0].toUpperCase() + name.slice(1)}</h1>
      <h2 className={styles.subtitle}>Posts:</h2>
      <Stack spacing={2} className={styles.posts}>
        {posts.length < 1 ? (
          <p className={styles.subtitle}>No posts yet!</p>
        ) : (
          posts.map((post) => {
            return (
              <HomePost
                title={post.title}
                date={post.createdAt}
                author={name}
                subribbit={post.subribbit.name}
                id={post.id}
                key={post.id}
                img={post.image}
                votes={post.votes}
                onVote={handlePostVote}
              />
            );
          })
        )}
      </Stack>
      <h2 className={styles.subtitle}>Comments:</h2>
      <div className={styles.comments}>
        {comments.length < 1 ? (
          <p className={styles.subtitle}>No comments yet!</p>
        ) : (
          comments.map((comment) => {
            const score = comment.votes.reduce((acc, v) => acc + v.value, 0);
            return (
              <Link
                key={comment.id}
                className={styles.link}
                to={`/posts/${comment.postId}`}
              >
                <Comment
                  key={comment.id}
                  author={''}
                  disabled={true}
                  authorId={comment.authorId}
                  date={comment.createdAt}
                  text={comment.text}
                  id={comment.id}
                  score={score}
                />
              </Link>
            );
          })
        )}
      </div>
    </Stack>
  );
}
