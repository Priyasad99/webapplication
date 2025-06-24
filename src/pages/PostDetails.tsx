import { useParams } from 'react-router-dom';

import { Typography, CircularProgress, Box } from '@mui/material';
import { useGetPostByIdQuery } from '../redux/servicess/api';

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useGetPostByIdQuery(Number(id));

  if (isLoading) return <CircularProgress />;
  if (error || !post) return <div>Post not found</div>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body1">
        {post.body}
      </Typography>
    </Box>
  );
};

export default PostDetails;