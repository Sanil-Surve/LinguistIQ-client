import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import lessonReducer from "./lessonSlice";
import quizReducer from "./quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lesson: lessonReducer,
    quiz: quizReducer,
  },
});

