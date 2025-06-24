import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '../../redux/servicess/api';
import { Typography } from '@mui/material';

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = useGetPostByIdQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <Typography variant="h4">{post.title}</Typography>
      <Typography variant="body1">{post.body}</Typography>
    </div>
  );
};

export default PostDetails;