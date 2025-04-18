import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface AuthState {
  isAuthChecked: boolean;
  isLoggedIn: boolean;
  user: TUser | null;
  loginError?: string;
  registerError?: string;
}

const initialState: AuthState = {
  isAuthChecked: false,
  isLoggedIn: false,
  user: null
};

export const register = createAsyncThunk<TUser, TRegisterData>(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    const response = await registerUserApi(formData);
    if (!response.success)
      return rejectWithValue(
        'message' in response ? response.message : 'Произошла ошибка'
      );

    setCookie('accessToken', response.accessToken);
    setCookie('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    const response = await loginUserApi(formData);
    if (!response?.success)
      return rejectWithValue(
        'message' in response ? response.message : 'Ошибка входа'
      );

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logout = createAsyncThunk<void>(
  'auth/logout',
  async (_, { dispatch }) => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(authSlice.actions.clearAuth());
  }
);

export const fetchUser = createAsyncThunk<TUser>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    const res = await getUserApi();
    if (!res.success)
      return rejectWithValue(
        'message' in res ? res.message : 'Ошибка получения пользователя'
      );
    return res.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'auth/update',
  async (formData, { rejectWithValue }) => {
    const res = await updateUserApi(formData);
    if (!res.success)
      return rejectWithValue(
        'message' in res ? res.message : 'Ошибка обновления'
      );
    return res.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerError = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.registerError = undefined;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerError =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message;
      })

      .addCase(login.pending, (state) => {
        state.loginError = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.loginError = undefined;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

// Селекторы
export const selectIsLoggedIn = (state: { user: AuthState }) =>
  state.user.isLoggedIn;
export const selectUser = (state: { user: AuthState }) => state.user.user;
export const selectAuthChecked = (state: { user: AuthState }) =>
  state.user.isAuthChecked;
export const selectLoginError = (state: { user: AuthState }) =>
  state.user.loginError;
export const selectRegisterError = (state: { user: AuthState }) =>
  state.user.registerError;

export const authReducer = authSlice.reducer;
