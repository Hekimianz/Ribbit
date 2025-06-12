import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getUsersPosts } from '../../api/posts';
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
            return (
              <Link
                key={comment.id}
                className={styles.link}
                to={`/posts/${comment.postId}`}
              >
                <Comment text={comment.text} date={comment.createdAt} />
              </Link>
            );
          })
        )}
      </div>
    </Stack>
  );
}
