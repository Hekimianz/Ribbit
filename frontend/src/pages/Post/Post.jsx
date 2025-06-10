import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getPost } from '../../api/posts';
import { createComment } from '../../api/comments';
import { Stack, Button } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import Comment from '../../components/Comment/Comment';
import styles from './Post.module.css';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [invalid, setInvalid] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPost(id);
      if (data) setPost(data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!commentText) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [commentText]);

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
        <Link to={`/user/${post.author?.username}`}>
          Uploaded by {post.author?.username}
        </Link>
        <span>{formattedDate}</span>
        <Link to={`/subribbits/${post.subribbit?.name}`}>
          r/{post.subribbit?.name}
        </Link>
      </Stack>
      <h3>Comments</h3>
      <Stack
        direction="column"
        sx={{
          gap: '1rem',
          alignItems: 'center',
        }}
        className={styles.inputCont}
      >
        <textarea
          name="newComment"
          id="newComment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="New Comment"
        ></textarea>
        <Button
          type="submit"
          className="btn"
          variant="contained"
          color="customBtn"
          disabled={invalid}
          sx={{
            '&.Mui-disabled': {
              backgroundColor: '#ccc',
              color: '#666',
              cursor: 'not-allowed',
              boxShadow: 'none',
              marginBottom: '1rem',
            },
          }}
          onClick={async () => {
            await createComment(id, commentText);
            const updatedPost = await getPost(id);
            setPost(updatedPost);
            setCommentText('');
          }}
        >
          Post comment
        </Button>
      </Stack>
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
