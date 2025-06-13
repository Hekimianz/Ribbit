import styles from './NewPost.module.css';
import { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { createPost } from '../../api/posts';
import { getAllSubs } from '../../api/subs';
import { useNavigate } from 'react-router';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [subs, setSubs] = useState([]);
  const [selectedSub, setSelectedSub] = useState('');
  const [invalid, setInvalid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubs = async () => {
      const data = await getAllSubs();
      if (data) {
        setSubs(data);
        setSelectedSub(data[0].id);
      }
    };
    fetchSubs();
  }, []);

  useEffect(() => {
    setInvalid(!title || (!content && !file));
  }, [title, content, file]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('textContent', content);
    formData.append('subribbitId', selectedSub);
    if (file) formData.append('image', file);
    try {
      const data = await createPost(formData);
      navigate(`/posts/${data.post.id}`);
    } catch (error) {
      console.error('Upload failed: ', error);
    }
  };

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
        <FormControl fullWidth>
          <InputLabel id="sub-select-label">SubRibbit</InputLabel>
          <Select
            labelId="sub-select-label"
            id="sub-select"
            value={selectedSub}
            label="SubRibbit"
            inputProps={{ accept: 'image/*' }}
            onChange={(e) => setSelectedSub(e.target.value)}
          >
            {subs.map((sub) => {
              return (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
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
        <label className={styles.label} htmlFor="image">
          Image (optional):
        </label>
        <input
          className={styles.input}
          type="file"
          name="image"
          id="image"
          onChange={(e) => setFile(e.target.files[0])}
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
        onClick={handleSubmit}
      >
        Post
      </Button>
    </div>
  );
}
