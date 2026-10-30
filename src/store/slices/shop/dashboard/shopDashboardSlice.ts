import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import type { RootState } from "@/store/store";
import { ShopDashboardData } from "@/types/payment";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State { data: ShopDashboardData | null; loading: boolean; error: string | null }
const initialState: State = { data: null, loading: false, error: null };

export const fetchShopDashboard = createAsyncThunk<
  ShopDashboardData,
  void,
  { state: RootState; rejectValue: string }
>(
  "shopDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.SHOP.DASHBOARD);
      return res.data.data as ShopDashboardData;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Dashboard load nahi ho saka"),
      );
    }
  },
  {
    condition: (_, { getState }) => !getState().shopDashboard.loading,
  },
);

const shopDashboardSlice = createSlice({
  name: "shopDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopDashboard.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchShopDashboard.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
      .addCase(fetchShopDashboard.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export default shopDashboardSlice.reducer;
