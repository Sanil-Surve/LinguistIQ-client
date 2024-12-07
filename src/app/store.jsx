import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import lessonReducer from "./slices/lessonSlice";
import quizReducer from "./slices/quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lesson: lessonReducer,
    quiz: quizReducer,
  },
});

