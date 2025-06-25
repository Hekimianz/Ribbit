import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { getPost, deletePost, vote as postVote } from '../../api/posts';
import { createComment, vote } from '../../api/comments';
import { Stack, Button, Backdrop, Skeleton } from '@mui/material';
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
  const [imgLoaded, setImgLoaded] = useState(false);

  const navigate = useNavigate();

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

  const handlePostVote = async (value, postId, userId) => {
    await postVote(value, postId);

    setPost((prevPost) => {
      const existingVote = prevPost.votes.find((v) => v.userId === userId);
      let updatedVotes;

      if (!existingVote) {
        // New vote
        updatedVotes = [...prevPost.votes, { userId, value }];
      } else if (existingVote.value === value) {
        // Toggle off (remove vote)
        updatedVotes = prevPost.votes.filter((v) => v.userId !== userId);
      } else {
        // Change vote value
        updatedVotes = prevPost.votes.map((v) =>
          v.userId === userId ? { ...v, value } : v
        );
      }

      return {
        ...prevPost,
        votes: updatedVotes,
      };
    });
  };

  const handleCommentVote = async (value, commentId) => {
    await vote(value, commentId);
    setPost((prev) => {
      const updatedComments = prev.comments.map((comment) => {
        if (comment.id === commentId) {
          const existingVote = comment.votes.find((v) => v.userId === user?.id);
          let newVotes;

          if (!existingVote) {
            newVotes = [...comment.votes, { userId: user?.id, value }];
          } else if (existingVote.value === value) {
            newVotes = comment.votes.filter((v) => v.userId !== user?.id);
          } else {
            newVotes = comment.votes.map((v) =>
              v.userId === user?.id ? { ...v, value } : v
            );
          }

          return { ...comment, votes: newVotes };
        }
        return comment;
      });

      return { ...prev, comments: updatedComments };
    });
  };

  const userVote = post?.votes?.find((v) => v.userId === user.id);
  const voteValue = userVote?.value;

  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      })
    : null;
  return (
    <Stack className={styles.wrapper} direction="column" spacing={2}>
      <h1>{post.title}</h1>
      {/* {post.image && <img src={post.image} />} */}
      {post.image && !imgLoaded && <Skeleton width={600} height={400} />}
      {post.image && <img src={post.image} onLoad={() => setImgLoaded(true)} />}
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
        <Stack direction="row" spacing={0.5}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            className={styles.upvote}
            fill={voteValue === 1 ? '#73B65F' : '#000'}
            onClick={() => {
              handlePostVote(1, id, user.id);
            }}
          >
            <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
          </svg>
          <span>{post?.votes?.reduce((acc, v) => acc + v.value, 0)}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16px"
            viewBox="0 -960 960 960"
            width="16px"
            className={styles.downvote}
            fill={voteValue === -1 ? '#f53131' : '#000'}
            onClick={() => {
              handlePostVote(-1, id, user.id);
            }}
          >
            <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
          </svg>
        </Stack>
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
        const score = comment.votes.reduce((acc, v) => acc + v.value, 0);
        return (
          <Comment
            key={comment.id}
            author={comment.author.username}
            authorId={comment.authorId}
            date={comment.createdAt}
            text={comment.text}
            id={comment.id}
            votes={comment.votes}
            userId={user?.id}
            score={score}
            onVote={handleCommentVote}
          />
        );
      })}
    </Stack>
  );
}
