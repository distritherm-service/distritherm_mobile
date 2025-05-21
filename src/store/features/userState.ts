import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/Users/User";

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
