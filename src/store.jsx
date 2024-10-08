import { configureStore } from '@reduxjs/toolkit';
import lessonReducer from './lessonSlice';
import quizReducer from './quizSlice';

export const store = configureStore({
  reducer: {
    lesson: lessonReducer,
    quiz: quizReducer,
  },
});