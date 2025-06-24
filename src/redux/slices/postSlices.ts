import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types";


const initialState: Post[] = [];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Example reducer (optional, adjust as needed)
    setPosts: (state, action: PayloadAction<Post[]>) => {
      return action.payload;
    },
  },
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;