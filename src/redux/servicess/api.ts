import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post } from '../../types';

// Helper functions for localStorage
const loadPostsFromLocalStorage = () => {
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : [];
};

const savePostsToLocalStorage = (posts: Post[]) => {
  localStorage.setItem('posts', JSON.stringify(posts));
};

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  tagTypes: ['Posts', 'Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
      providesTags: ['Posts'],
      transformResponse: (response: Post[]) => {
        // Combine posts from the API with localStorage posts
        const localPosts = loadPostsFromLocalStorage();
        return [...response, ...localPosts]; // Show public API posts + local posts
      },
    }),

    getPostById: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
      transformResponse: (response: Post) => {
        // Try to find the post in localStorage first
        const localPosts = loadPostsFromLocalStorage();
        const localPost = localPosts.find((post: Post) => post.id === response.id);
        return localPost || response;
      },
    }),

    createPost: builder.mutation<Post, Omit<Post, 'id'>>({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            // Add temporary post with negative ID for optimistic UI update
            const tempPost = { ...arg, id: Date.now() * -1 };
            draft.unshift(tempPost);
            savePostsToLocalStorage(draft); // Save to localStorage
          })
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
              const index = draft.findIndex(post => post && typeof post.id === 'number' && post.id < 0);
              if (index !== -1) {
                draft[index] = data;
              }
              savePostsToLocalStorage(draft); // Save updated list to localStorage
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    updatePost: builder.mutation<Post, Post>({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      onQueryStarted: async ({ id, ...patch }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find(p => p.id === id);
            if (post) {
              Object.assign(post, patch);
              savePostsToLocalStorage(draft); // Save to localStorage
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          postsApi.util.updateQueryData('getPosts', undefined, (draft) => {
            const index = draft.findIndex(post => post.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
              savePostsToLocalStorage(draft); // Save to localStorage
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;