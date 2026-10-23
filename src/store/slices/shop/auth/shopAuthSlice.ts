import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { SHOP_USER_KEY, TOKEN_KEY } from "@/store/ApiServices/config";
import { getErrorMessage } from "@/shared/apiError";
import { ShopAuthState, ShopLoginPayload, ShopSignupPayload, ShopUser } from "@/types/auth";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState: ShopAuthState = { user: null, access_token: null, loading: false, error: null };

/* ---------------- LOGIN ---------------- */
export const shopLogin = createAsyncThunk(
  "shopAuth/login",
  async (payload: ShopLoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URLS.SHOP_AUTH.LOGIN, payload);
      const { user, access_token } = response.data.data;
      const days = payload.rememberMe ? 7 : 1;
      Cookies.set(TOKEN_KEY, access_token, { expires: days });
      Cookies.set(SHOP_USER_KEY, JSON.stringify(user), { expires: days });
      return { user, access_token } as { user: ShopUser; access_token: string };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login nahi ho saka"));
    }
  },
);

/* ---------------- SIGNUP (goes to admin as "pending") ---------------- */
export const shopSignup = createAsyncThunk(
  "shopAuth/signup",
  async (payload: ShopSignupPayload, { rejectWithValue }) => {
    try {
      await api.post(API_URLS.SHOP_AUTH.SIGNUP, payload);
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registration nahi ho saki"));
    }
  },
);

const shopAuthSlice = createSlice({
  name: "shopAuth",
  initialState,
  reducers: {
    shopLogout: (state) => {
      state.user = null;
      state.access_token = null;
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(SHOP_USER_KEY);
    },
    rehydrateShopFromCookies: (state) => {
      const token = Cookies.get(TOKEN_KEY);
      const user = Cookies.get(SHOP_USER_KEY);
      if (token && user) {
        state.access_token = token;
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(shopLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(shopLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
      })
      .addCase(shopLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(shopSignup.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(shopSignup.fulfilled, (state) => { state.loading = false; })
      .addCase(shopSignup.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { shopLogout, rehydrateShopFromCookies } = shopAuthSlice.actions;
export default shopAuthSlice.reducer;
