import { getAllSubs } from '../../api/subs';
import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Sub from '../../components/Sub/Sub';
export default function Subribbits() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllSubs();
      if (data) setSubs(data);
    };
    fetchData();
  }, []);

  return (
    <Stack sx={{ alignItems: 'center' }} spacing={2}>
      {subs.map((sub) => {
        return (
          <Sub key={sub.id} name={sub.name} description={sub.description} />
        );
      })}
    </Stack>
  );
}
