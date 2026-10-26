import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from "@/store/ApiServices/config";
import { getErrorMessage } from "@/shared/apiError";
import {
  AdminAuthState,
  AdminLoginPayload,
  AdminUser,
} from "@/types/adminAuth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState: AdminAuthState = {
  user: null,
  access_token: null,
  loading: false,
  error: null,
};

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (payload: AdminLoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URLS.ADMIN_AUTH.LOGIN, payload);
      const { user, access_token } = response.data.data;
      const days = payload.rememberMe ? 7 : 1;
      Cookies.set(ADMIN_TOKEN_KEY, access_token, { expires: days, path: "/" });
      Cookies.set(ADMIN_USER_KEY, JSON.stringify(user), { expires: days, path: "/" });
      return { user, access_token } as {
        user: AdminUser;
        access_token: string;
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to sign in as admin"),
      );
    }
  },
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.user = null;
      state.access_token = null;
      Cookies.remove(ADMIN_TOKEN_KEY, { path: "/" });
      Cookies.remove(ADMIN_USER_KEY, { path: "/" });
    },
    rehydrateAdminFromCookies: (state) => {
      const token = Cookies.get(ADMIN_TOKEN_KEY);
      const user = Cookies.get(ADMIN_USER_KEY);
      if (token && user) {
        try {
          state.access_token = token;
          state.user = JSON.parse(user);
        } catch {
          Cookies.remove(ADMIN_TOKEN_KEY, { path: "/" });
          Cookies.remove(ADMIN_USER_KEY, { path: "/" });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { adminLogout, rehydrateAdminFromCookies } =
  adminAuthSlice.actions;
export default adminAuthSlice.reducer;
