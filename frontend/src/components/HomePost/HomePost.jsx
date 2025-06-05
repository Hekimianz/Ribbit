import { Stack } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
export default function HomePost({ title, date, author, subribbit }) {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  return (
    <div className="post">
      <h2>{title}</h2>
      <Stack spacing={0.5} direction="row">
        <span className="date">{formattedDate} |</span>
        <span className="author">by {author} |</span>
        <span className="subribbit">r/{subribbit}</span>
      </Stack>
    </div>
  );
}
