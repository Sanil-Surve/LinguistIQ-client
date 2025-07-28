// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const generateQuizzes = createAsyncThunk(
//   'quiz/generateQuizzes',
//   async (lessonContent) => {
//     const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generateQuizzes`, { lessonContent });
//     return response.data.quizzes;
//   }
// );

// const quizSlice = createSlice({
//   name: 'quiz',
//   initialState: { quizzes: '', status: null },
//   extraReducers: (builder) => {
//     builder
//       .addCase(generateQuizzes.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(generateQuizzes.fulfilled, (state, action) => {
//         state.quizzes = action.payload;
//         state.status = 'success';
//       })
//       .addCase(generateQuizzes.rejected, (state) => {
//         state.status = 'failed';
//       });
//   },
// });

// export default quizSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const generateQuizzes = createAsyncThunk(
  "quiz/generateQuizzes",
  async (lessonContent, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        // `${import.meta.env.VITE_BACKEND_URL}/api/generateQuizzes`,
        `https://linguistiq.shop/api/generateQuizzes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lessonContent }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let quizContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              quizContent += parsed.content;
              // Dispatch an action to update the streaming content
              dispatch(updateStreamingQuizzes(quizContent));
            } catch (err) {
              console.error("Error parsing SSE data:", err);
            }
          }
        }
      }

      return quizContent;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: "",
    status: null, // 'idle' | 'loading' | 'streaming' | 'success' | 'failed'
    error: null,
  },
  reducers: {
    updateStreamingQuizzes: (state, action) => {
      state.quizzes = action.payload || "";
      state.status = "streaming";
    },
    resetQuizzes: (state) => {
      state.quizzes = "";
      state.status = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuizzes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload;
        state.status = "success";
      })
      .addCase(generateQuizzes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateStreamingQuizzes, resetQuizzes } = quizSlice.actions;
export default quizSlice.reducer;
