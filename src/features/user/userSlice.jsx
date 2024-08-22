import { createSlice } from '@reduxjs/toolkit';

// Function to fetch user data from localStorage
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// initial state for the user slice
const initialState = {
  user: getUserFromLocalStorage(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.setItem('user', null);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
