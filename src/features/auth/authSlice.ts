import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist-indexeddb-storage';
import type { RootState, AppThunkConfig } from '../../app/store';
import twitchAuthApi from './twitchAuthApi';

interface AuthState {
  state: 'authenticated' | 'unauthenticated' | 'authenticating';
  token?: string;
  username?: string;
  profilePictureUrl?: string;
  scopes?: string[];

  revalidateTimeoutHandle?: NodeJS.Timeout;
}

const initialState: AuthState = {
  state: 'unauthenticated',
  scopes: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticateWithToken.pending, (state) => {
      state.state = 'authenticating';
    });
    builder.addCase(authenticateWithToken.fulfilled, (state, { payload }) => {
      state.token = payload.token;
      state.username = payload.username;
      state.scopes = payload.scopes;
      state.state = 'authenticated';
      state.profilePictureUrl = payload.profilePictureUrl;
      state.revalidateTimeoutHandle = payload.revalidateTimeoutHandle;
    });
    builder.addCase(authenticateWithToken.rejected, (state) => {
      state.token = undefined;
      state.username = undefined;
      state.profilePictureUrl = undefined;
      state.scopes = [];
      state.state = 'unauthenticated';
    });
    builder.addCase(validateToken.fulfilled, (state, { payload }) => {
      state.revalidateTimeoutHandle = payload.revalidateTimeoutHandle;
    });
    builder.addCase(validateToken.rejected, (state) => {
      state.token = undefined;
      state.username = undefined;
      state.profilePictureUrl = undefined;
      state.scopes = [];
      state.state = 'unauthenticated';
      state.revalidateTimeoutHandle = undefined;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.token = undefined;
      state.username = undefined;
      state.profilePictureUrl = undefined;
      state.scopes = [];
      state.state = 'unauthenticated';
      state.revalidateTimeoutHandle = undefined;
    });
  },
});

export const login = createAsyncThunk('auth/login', async (returnUrl: string | undefined, thunkApi) => {
  twitchAuthApi.redirectToLogin(returnUrl);
});

export const authenticateWithToken = createAsyncThunk(
  'auth/authenticateWithToken',
  async (token: string | undefined, thunkApi) => {
    if (!token) {
      return thunkApi.rejectWithValue('missing token');
    }

    const validateTokenResponse = await twitchAuthApi.validateToken(token);
    if (validateTokenResponse.status !== 200) {
      return thunkApi.rejectWithValue(validateTokenResponse.status);
    }

    const userInfoResponse = await twitchAuthApi.getUserInfo(token);
    if (userInfoResponse.status !== 200) {
      return thunkApi.rejectWithValue(userInfoResponse.status);
    }

    const revalidateTimeoutHandle = setTimeout(() => {
      thunkApi.dispatch(validateToken(token));
    }, 60 * 60 * 1000);

    return {
      token,
      username: userInfoResponse.data.preferred_username ?? validateTokenResponse.data.login,
      profilePictureUrl: userInfoResponse.data.picture,
      scopes: validateTokenResponse.data.scopes,
      revalidateTimeoutHandle,
    };
  }
);

export const validateToken = createAsyncThunk('auth/validateToken', async (token: string | undefined, thunkApi) => {
  if (!token) {
    return thunkApi.rejectWithValue('missing token');
  }

  const validateTokenResponse = await twitchAuthApi.validateToken(token);
  if (validateTokenResponse.status !== 200) {
    return thunkApi.rejectWithValue(validateTokenResponse.status);
  }

  const revalidateTimeoutHandle = setTimeout(() => {
    thunkApi.dispatch(validateToken(token));
  }, 60 * 60 * 1000);

  return { revalidateTimeoutHandle };
});

export const logout = createAsyncThunk<boolean, string | undefined, AppThunkConfig>(
  'auth/logout',
  async (token: string | undefined = undefined, thunkApi) => {
    const { auth } = thunkApi.getState();
    if (!token) {
      token = auth.token;
    }

    if (auth.revalidateTimeoutHandle) {
      clearTimeout(auth.revalidateTimeoutHandle);
    }

    if (token) {
      await twitchAuthApi.revokeToken(token);
    }
    return true;
  }
);

export const selectAuthState = (state: RootState) => state.auth.state;
export const selectAccessToken = (state: RootState) => state.auth.token;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectProfilePictureUrl = (state: RootState) => state.auth.profilePictureUrl;

const authReducer = persistReducer(
  {
    key: 'auth',
    storage: storage('twitch-clip-queue'),
    version: 1,
    whitelist: ['token'],
  },
  authSlice.reducer
);
export default authReducer;
