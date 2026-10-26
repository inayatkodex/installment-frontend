import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { AdminDashboardStats } from "@/types/adminShop";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  stats: AdminDashboardStats | null;
  loading: boolean;
  error: string | null;
}
const initialState: State = { stats: null, loading: false, error: null };

export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.ADMIN.DASHBOARD);
      return res.data.data as AdminDashboardStats;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load admin dashboard"),
      );
    }
  },
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (s, a) => {
        s.loading = false;
        s.stats = a.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export default adminDashboardSlice.reducer;
