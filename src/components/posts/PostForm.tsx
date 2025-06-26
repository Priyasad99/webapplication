import { Button, TextField, Alert, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useCreatePostMutation, useUpdatePostMutation } from '../../redux/servicess/api';
import type { Post } from '../../types';
import { useState } from 'react';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  body: Yup.string().required('Body is required'),
});

interface PostFormProps {
  initialValues?: Post;
  onSubmitSuccess?: () => void;
  isEdit?: boolean;
  onCancel?: () => void; // Add onCancel prop
}

const PostForm = ({
  initialValues = { title: '', body: '', userId: 1 },
  onSubmitSuccess,
  isEdit = false,
  onCancel, // Add onCancel prop
}: PostFormProps) => {
  const [createPost, { isLoading: isCreating, error: createError }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdating, error: updateError }] = useUpdatePostMutation();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (values: Post) => {
    try {
      setSuccessMessage('');
      
      if (isEdit && initialValues.id) {
        await updatePost({ id: initialValues.id, ...values }).unwrap();
        setSuccessMessage('Post updated successfully!');
      } else {
        await createPost({ ...values, userId: 1 }).unwrap();
        setSuccessMessage('Post created successfully!');
      }
      
      setTimeout(() => {
        onSubmitSuccess?.();
      }, 1500);
      
    } catch (error) {
      console.error('Failed to save post', error);
    }
  };

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  return (
    <Box>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to {isEdit ? 'update' : 'create'} post. Please try again.
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              name="title"
              label="Title"
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
              fullWidth
              margin="normal"
              disabled={isLoading}
            />
            <Field
              as={TextField}
              name="body"
              label="Body"
              error={touched.body && !!errors.body}
              helperText={touched.body && errors.body}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              disabled={isLoading}
            />
            
            {/* Button container - both buttons side by side */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isEdit ? 'Updating...' : 'Creating...') 
                  : (isEdit ? 'Update' : 'Create')} Post
              </Button>
              
              {onCancel && (
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PostForm;