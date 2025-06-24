import { CssBaseline, Container } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import PostDetailsPage from './pages/PostDetails';
import PostEdit from './pages/PostEdits';
import PostCreate from './pages/PoastCreate';
import PostList from './components/posts/Postlist';
import PostDetails from './pages/PostDetails';


const App = () => {
  return (
    <>
      <CssBaseline />
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<PostList />} /> 
          <Route path="/posts" element={<PostDetails />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/posts/create" element={<PostCreate />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;