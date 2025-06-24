
import { Routes, Route } from 'react-router-dom';
import PostList from '../components/posts/Postlist';
import PostCreate from './PoastCreate';
import PostEdits from './PostEdits';
import PostDetails from './PostDetails';

const Post = () => {
  return (
    <>
      <Routes>
        <Route path="/create" element={<PostCreate />} />
        <Route path="/:id" element={<PostDetails />} />
        <Route path="/:id/edit" element={<PostEdits />} />
      </Routes>

      {/* No more localPosts prop needed - RTK Query handles everything */}
      <PostList />
    </>
  );
};

export default Post;