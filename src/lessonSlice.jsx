import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateLesson = createAsyncThunk(
  'lesson/generateLesson',
  async (userInput) => {
    const response = await axios.post(`https://linguistiq-backend.onrender.com/api/generateLesson`, { userInput });
    return response.data.lesson;
  }
);

const lessonSlice = createSlice({
  name: 'lesson',
  initialState: { lesson: '', status: null },
  extraReducers: (builder) => {
    builder
      .addCase(generateLesson.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generateLesson.fulfilled, (state, action) => {
        state.lesson = action.payload;
        state.status = 'success';
      })
      .addCase(generateLesson.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default lessonSlice.reducer;