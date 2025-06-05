import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getPost } from '../../api/posts';
import { Stack } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import Comment from '../../components/Comment/Comment';
import styles from './Post.module.css';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPost(id);
      if (data) setPost(data);
    };
    fetchData();
  }, [id]);
  console.log(post);
  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      })
    : null;
  return (
    <Stack className={styles.wrapper} direction="column" spacing={2}>
      <h1>{post.title}</h1>
      {post.image && <img src={post.image} />}
      {post.textContent && (
        <p className={styles.textContent}>{post.textContent}</p>
      )}
      <Stack spacing={2} direction="row">
        <Link to={`/users/${post.author?.username}`}>
          Uploaded by {post.author?.username}
        </Link>
        <span>{formattedDate}</span>
        <Link to={`/subribbits/${post.subribbit?.name}`}>
          r/{post.subribbit?.name}
        </Link>
      </Stack>
      <h3>Comments</h3>
      {post.comments?.map((comment) => {
        return (
          <Comment
            key={comment.id}
            author={comment.author.username}
            authorId={comment.authorId}
            date={comment.createdAt}
            text={comment.text}
          />
        );
      })}
    </Stack>
  );
}
