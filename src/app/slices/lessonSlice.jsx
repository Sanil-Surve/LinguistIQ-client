// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const generateLesson = createAsyncThunk(
//   'lesson/generateLesson',
//   async (userInput) => {
//     const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generateLesson`, { userInput });
//     return response.data.lesson;
//   }
// );

// const lessonSlice = createSlice({
//   name: 'lesson',
//   initialState: { lesson: '', status: null },
//   extraReducers: (builder) => {
//     builder
//       .addCase(generateLesson.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(generateLesson.fulfilled, (state, action) => {
//         state.lesson = action.payload;
//         state.status = 'success';
//       })
//       .addCase(generateLesson.rejected, (state) => {
//         state.status = 'failed';
//       });
//   },
// });

// export default lessonSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const generateLesson = createAsyncThunk(
  "lesson/generateLesson",
  async (userInput, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/generateLesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let lessonContent = "";

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
              lessonContent += parsed.content;
              // Dispatch an action to update the streaming content
              dispatch(updateStreamingContent(lessonContent));
            } catch (err) {
              console.error("Error parsing SSE data:", err);
            }
          }
        }
      }

      return lessonContent;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState: {
    lesson: "",
    status: null, // 'idle' | 'loading' | 'streaming' | 'success' | 'failed'
    error: null,
  },
  reducers: {
    updateStreamingContent: (state, action) => {
      state.lesson = action.payload;
      state.status = "streaming";
    },
    resetLesson: (state) => {
      state.lesson = "";
      state.status = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateLesson.fulfilled, (state, action) => {
        state.lesson = action.payload;
        state.status = "success";
      })
      .addCase(generateLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { updateStreamingContent, resetLesson } = lessonSlice.actions;
export default lessonSlice.reducer;
