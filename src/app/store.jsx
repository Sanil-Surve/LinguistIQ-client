import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import lessonReducer from "./slices/lessonSlice";
import quizReducer from "./slices/quizSlice";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  lesson: lessonReducer,
  quiz: quizReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);
