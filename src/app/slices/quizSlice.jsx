import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateQuizzes = createAsyncThunk(
  'quiz/generateQuizzes',
  async (lessonContent) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generateQuizzes`, { lessonContent });
    return response.data.quizzes;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState: { quizzes: '', status: null },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload;
        state.status = 'success';
      })
      .addCase(generateQuizzes.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default quizSlice.reducer;