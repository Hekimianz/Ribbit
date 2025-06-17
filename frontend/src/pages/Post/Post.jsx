import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getPost, deletePost } from '../../api/posts';
import { createComment } from '../../api/comments';
import { Stack, Button, Backdrop } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/authContext';
import Comment from '../../components/Comment/Comment';
import styles from './Post.module.css';

export default function Post() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [invalid, setInvalid] = useState(true);
  const [confDelete, setConfDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPost(id);
      if (data) setPost(data);
    };
    fetchData();
  }, [id]);
  console.log(post);

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
      {confDelete && (
        <Backdrop
          open={confDelete}
          className={styles.confDelete}
          sx={{
            alignItems: 'center',
            zIndex: 2,
            color: '#FDEFD5',
          }}
        >
          <Stack gap="2rem">
            <h2>Are you sure you want to delete this post?</h2>
            <Stack
              direction="row"
              gap="2rem"
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                sx={{
                  background: '#ae2012',
                  color: '#fff',
                }}
                onClick={() => {
                  deletePost(post.id);
                  navigate('/');
                }}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: '#73B65F',
                  color: '#000',
                }}
                onClick={() => setConfDelete(false)}
              >
                No
              </Button>
            </Stack>
          </Stack>
        </Backdrop>
      )}
      <Stack spacing={2} direction="row">
        <Link to={`/user/${post.author?.username}`}>
          Uploaded by {post.author?.username}
        </Link>
        <span>{formattedDate}</span>
        <Link to={`/subribbits/${post.subribbit?.name}`}>
          r/{post.subribbit?.name}
        </Link>
        {user?.id === post.authorId && (
          <span
            onClick={() => {
              setConfDelete(true);
            }}
            className={styles.delete}
          >
            Delete Post
          </span>
        )}
      </Stack>

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
