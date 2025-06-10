import styles from './NewPost.module.css';
import { useState, useEffect } from 'react';
import { Stack, Button } from '@mui/material';
import { createPost } from '../../api/posts';
import { useNavigate } from 'react-router';
export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [invalid, setInvalid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!title || !content) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  }, [title, content]);

  return (
    <div className={styles.wrapper}>
      <Stack
        direction="row"
        className={styles.container}
        sx={{
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <label className={styles.label} htmlFor="title">
          Title:
        </label>
        <input
          className={styles.input}
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Stack>
      <Stack
        direction="row"
        className={styles.container}
        sx={{
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <label className={styles.label} htmlFor="content">
          Text Content:
        </label>
        <textarea
          className={styles.content}
          name="content"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="customBtn"
        disabled={invalid}
        sx={{
          '&.Mui-disabled': {
            backgroundColor: '#ccc',
            color: '#666',
            cursor: 'not-allowed',
            boxShadow: 'none',
          },
        }}
        onClick={async () => {
          console.log(title, content);
          const data = await createPost(
            title,
            content,
            '2fdb145a-64fb-470e-921a-964a087a59b0'
          );
          navigate(`/posts/${data.post.id}`);
        }}
      >
        Post
      </Button>
    </div>
  );
}
