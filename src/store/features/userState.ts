import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import storageService from "../../services/storageService";
import navigationService from "../../services/navigationService";
import authService from "src/services/authService";

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

// 🔄 Initialiser l'authentification au démarrage
export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async () => {
    const isAuthenticated = await storageService.getIsAuthenticated();
    const userData = await storageService.getUserData();
    const hasTokens = await storageService.hasValidTokens();

    return {
      isAuthenticated: isAuthenticated && hasTokens,
      user: userData,
    };
  }
);

// 🔐 Connecter un utilisateur
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({
    user,
    accessToken,
    refreshToken,
  }: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => {
    await storageService.setAccessToken(accessToken);
    await storageService.setRefreshToken(refreshToken);
    await storageService.setUserData(user);
    await storageService.setIsAuthenticated(true);

    return user;
  }
);

// 🚪 Déconnecter un utilisateur
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  try {
    const refreshToken = await storageService.getRefreshToken();
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
  } catch (error) {
    // Continue with logout even if API call fails
    console.error("Logout API call failed:", error);
  } finally {
    await storageService.clearAll();
    navigationService.navigate("Home");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storageService.setUserData(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
