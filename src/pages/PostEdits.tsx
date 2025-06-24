import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/posts/PostForm';
import { useGetPostByIdQuery } from '../redux/servicess/api';
import { CircularProgress } from '@mui/material';

const PostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useGetPostByIdQuery(Number(id));

  const handleSubmitSuccess = () => {
    navigate(`/posts/${id}`); // Navigate back to post details
  };

  if (isLoading) return <CircularProgress />;
  if (error || !post) return <div>Post not found</div>;

  return (
    <PostForm 
      initialValues={post} 
      isEdit={true} 
      onSubmitSuccess={handleSubmitSuccess} 
    />
  );
};

export default PostEdit;