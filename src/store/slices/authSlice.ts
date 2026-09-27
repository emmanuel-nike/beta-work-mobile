import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  fetchArtisanStatus,
  fetchCurrentUser,
  updateProfile,
  login,
  logout as logoutRequest,
  type ArtisanVerificationStatus,
  type AuthTokenResponse,
  type UpdateProfilePayload,
} from '../../api/auth';
import { ApiError, setAuthToken } from '../../api/client';
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
} from '../authStorage';

export type AuthUser = AuthTokenResponse['user'];

export type AuthSession = Readonly<{
  token: string | null;
  tokenType: string | null;
  user: AuthUser;
}>;

type AuthState = {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  token: string | null;
  tokenType: string | null;
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isBootstrapping: true,
  token: null,
  tokenType: null,
  user: null,
  status: 'idle',
  error: null,
};

function sessionFromTokenResponse(payload: AuthTokenResponse): AuthSession {
  return {
    token: payload.value,
    tokenType: payload.type,
    user: payload.user,
  };
}

export const bootstrapAuth = createAsyncThunk<AuthSession | null>(
  'auth/bootstrap',
  async () => {
    const stored = await loadStoredSession();
    if (!stored?.token) {
      return null;
    }

    setAuthToken(stored.token);

    try {
      const { user } = await fetchCurrentUser();
      const refreshed: AuthSession = {
        token: stored.token,
        tokenType: stored.tokenType,
        user,
      };
      await persistSession(refreshed);
      return refreshed;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await clearStoredSession();
        setAuthToken(null);
        return null;
      }
      return stored;
    }
  },
);

export const loginUser = createAsyncThunk<
  AuthSession,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await login(email, password);
    const session = sessionFromTokenResponse(response);
    await persistSession(session);
    return session;
  } catch (error) {
    return rejectWithValue(
      error instanceof ApiError
        ? error.message
        : 'Unable to sign in. Please try again.',
    );
  }
});

export const refreshCurrentUser = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: number | undefined; state: { auth: AuthState } }
>('auth/refreshMe', async (_, { getState, rejectWithValue }) => {
  try {
    const { user } = await fetchCurrentUser();
    const { token, tokenType } = getState().auth;
    if (token) {
      await persistSession({ token, tokenType, user });
    }
    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.status);
    }
    return rejectWithValue(undefined);
  }
});

export const refreshArtisanStatus = createAsyncThunk<
  ArtisanVerificationStatus,
  void,
  { rejectValue: number | undefined; state: { auth: AuthState } }
>('auth/refreshArtisanStatus', async (_, { rejectWithValue }) => {
  try {
    const { verificationStatus } = await fetchArtisanStatus();
    return verificationStatus;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.status);
    }
    return rejectWithValue(undefined);
  }
});

export const updateUserProfile = createAsyncThunk<
  AuthUser,
  UpdateProfilePayload,
  { rejectValue: string; state: { auth: AuthState } }
>('auth/updateProfile', async (payload, { getState, rejectWithValue }) => {
  try {
    const { user } = await updateProfile(payload);
    const { token, tokenType } = getState().auth;
    if (token) {
      await persistSession({ token, tokenType, user });
    }
    return user;
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Unable to update profile');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutRequest();
  } catch {
    // Even if the server rejects the logout call we still clear locally.
  }
  await clearStoredSession();
  setAuthToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthSession>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.tokenType = action.payload.tokenType;
      state.user = action.payload.user;
      state.status = 'idle';
      state.error = null;
    },
    signOut() {
      return { ...initialState, isBootstrapping: false };
    },
    clearAuthError(state) {
      state.error = null;
      if (state.status === 'failed') {
        state.status = 'idle';
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapAuth.pending, state => {
        state.isBootstrapping = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.isBootstrapping = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.tokenType = action.payload.tokenType;
          state.user = action.payload.user;
        }
      })
      .addCase(bootstrapAuth.rejected, state => {
        state.isBootstrapping = false;
      })
      .addCase(loginUser.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.tokenType = action.payload.tokenType;
        state.user = action.payload.user;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
      })
      .addCase(refreshCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshCurrentUser.rejected, (state, action) => {
        if (action.payload === 401) {
          return { ...initialState, isBootstrapping: false };
        }
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshArtisanStatus.fulfilled, (state, action) => {
        if (state.user) {
          state.user.artisanProfile = {
            ...state.user.artisanProfile,
            verificationStatus: action.payload,
          };
        }
      })
      .addCase(refreshArtisanStatus.rejected, (state, action) => {
        if (action.payload === 401) {
          return { ...initialState, isBootstrapping: false };
        }
      })
      .addCase(logoutUser.fulfilled, () => ({
        ...initialState,
        isBootstrapping: false,
      }));
  },
});

export const { setSession, signOut, clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
export { sessionFromTokenResponse };

export function createDemoSession(
  user: Pick<AuthUser, 'firstName' | 'role'> & Partial<AuthUser>,
): AuthSession {
  return {
    token: null,
    tokenType: null,
    user: {
      id: user.id ?? 0,
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
      role: user.role,
    },
  };
}

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsBootstrapping = (state: { auth: AuthState }) =>
  state.auth.isBootstrapping;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role;
export const selectIsArtisanVerified = (state: { auth: AuthState }) => {
  const user = state.auth.user;
  if (!user || user.role !== 'artisan') {
    return false;
  }
  // Approved is the only status that unlocks the full dashboard; anything
  // else (pending, rejected, or unknown) keeps the artisan on the pending view.
  return user.artisanProfile?.verificationStatus === 'approved';
};

export const selectArtisanVerificationStatus = (state: {
  auth: AuthState;
}) => state.auth.user?.artisanProfile?.verificationStatus;
