import PostForm from '../components/posts/PostForm';
import { useNavigate } from 'react-router-dom';

const PostCreate = () => {
  const navigate = useNavigate();

  const handleSubmitSuccess = () => {
    navigate('/');
  };

  return (
    <PostForm onSubmitSuccess={handleSubmitSuccess} />
  );
};

export default PostCreate;