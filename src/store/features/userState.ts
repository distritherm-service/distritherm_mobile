import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserWithClientDto } from "../../types/User";
import storageService from "../../services/storageService";
import usersService from "../../services/usersService";

interface UserState {
  isAuthenticated: boolean;
  user: UserWithClientDto | null;
  deconnectionLoading: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  deconnectionLoading: false,
};

// 🔄 Initialiser l'authentification au démarrage
export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async () => {
    const isAuthenticated = await storageService.getIsAuthenticated();
    const hasTokens = await storageService.hasValidTokens();

    if (isAuthenticated && hasTokens) {
      try {
        // Récupérer l'utilisateur depuis l'API
        const response: any = await usersService.getCurrentUser();
        return {
          isAuthenticated: true,
          user: response.user,
        };
      } catch (error) {
        await storageService.clearAll();
        return {
          isAuthenticated: false,
          user: null,
        };
      }
    }

    return {
      isAuthenticated: false,
      user: null,
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
    user: UserWithClientDto;
    accessToken: string;
    refreshToken: string;
  }) => {
    await storageService.setAccessToken(accessToken);
    await storageService.setRefreshToken(refreshToken);
    await storageService.setIsAuthenticated(true);

    return user;
  }
);

// 🚪 Déconnecter un utilisateur
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await storageService.clearAll();
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<UserWithClientDto>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setDeconnectionLoading: (state, action: PayloadAction<boolean>) => {
      state.deconnectionLoading = action.payload;
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
        state.deconnectionLoading = false;
      });
  },
});

export const { updateUser, setDeconnectionLoading } = userSlice.actions;
export default userSlice.reducer;
