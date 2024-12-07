import { createSlice } from "@reduxjs/toolkit";

// Load the initial user from local storage
const initialUser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save user to local storage
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Remove user from local storage
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;