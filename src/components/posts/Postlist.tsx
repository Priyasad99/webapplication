import { Button, Box, Typography, CircularProgress, DialogTitle, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useGetPostsQuery, useDeletePostMutation } from '../../redux/servicess/api';
import { useState } from 'react';
import PostForm from '../posts/PostForm';
import type { Post } from '../../types';

const PostList = () => {
  const { data: posts = [], isLoading, error } = useGetPostsQuery();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editPostData, setEditPostData] = useState<Post | null>(null);

  // Handle delete
  const handleDelete = async (id?: number) => {
    if (typeof id !== 'number') {
      console.error('Invalid post id:', id);
      return;
    }
    try {
      await deletePost(id).unwrap();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // Open edit dialog
  const handleEditPostClick = (post: Post) => {
    setEditPostData(post);
    setOpenDialog(true);
  };

  // Open create dialog
  const handleCreatePostClick = () => {
    setEditPostData(null); // Reset edit data for creating a new post
    setOpenDialog(true); // Open the dialog
  };

  // Close dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditPostData(null);
  };

  // Check if loading or error occurs
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading posts</div>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreatePostClick}>
          Create Post
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {posts.length > 0 ? (
          posts.map((post: Post) => (
            <Box
              key={post.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // Ensures the buttons are spaced at the bottom
                height: '100%', // Ensures the card takes up full height of the container
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>{post.title}</Typography>
              <Typography variant="body2" color="textSecondary">{post.body}</Typography>
              {/* Add this flexbox container for the buttons */}
              <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={() => handleEditPostClick(post)}>Edit</Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(post.id)}>Delete</Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No posts available</Typography>
        )}
      </Box>

      {/* Dialog for editing or creating a post */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{editPostData ? 'Edit Post' : 'Create Post'}</DialogTitle>
        <DialogContent>
          {editPostData ? (
            <PostForm
              initialValues={editPostData}
              onSubmitSuccess={handleDialogClose}
              isEdit={true}
              onCancel={handleDialogClose}
            />
          ) : (
            <PostForm
              initialValues={{ title: '', body: '', userId: 1 }} // Empty initial values for Create Post
              onSubmitSuccess={handleDialogClose}
              isEdit={false}
              onCancel={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PostList;