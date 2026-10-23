import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { AdminShop, AdminShopsResponse } from "@/types/adminShop";
import { ShopStatus } from "@/types/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  list: AdminShopsResponse | null;
  detail: AdminShop | null;
  loading: boolean;
  detailLoading: boolean;
  updating: boolean;
  error: string | null;
}
const initialState: State = { list: null, detail: null, loading: false, detailLoading: false, updating: false, error: null };

export const fetchAdminShops = createAsyncThunk(
  "adminShops/fetchList",
  async (params: { status?: string; fee?: string; search?: string; page?: number }, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.ADMIN.SHOPS, { params });
      return res.data.data as AdminShopsResponse;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load shops"));
    }
  },
);

export const fetchAdminShop = createAsyncThunk("adminShops/fetchDetail", async (id: string, { rejectWithValue }) => {
  try {
    const res = await api.get(API_URLS.ADMIN.SHOP_DETAIL(id));
    return res.data.data as AdminShop;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load shop details"));
  }
});

export const updateAdminShopStatus = createAsyncThunk(
  "adminShops/updateStatus",
  async (payload: { id: string; status: ShopStatus; reason?: string }, { rejectWithValue }) => {
    try {
      const res = await api.patch(API_URLS.ADMIN.SHOP_STATUS(payload.id), { status: payload.status, reason: payload.reason });
      return res.data.data as AdminShop;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update shop status"));
    }
  },
);

export const setAdminShopFee = createAsyncThunk(
  "adminShops/setFee",
  async (payload: { id: string; month: string; status: "paid" | "unpaid" }, { rejectWithValue }) => {
    try {
      const res = await api.patch(API_URLS.ADMIN.SHOP_FEE(payload.id), { month: payload.month, status: payload.status });
      return res.data.data as AdminShop;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update fee status"));
    }
  },
);

const adminShopsSlice = createSlice({
  name: "adminShops",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminShops.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminShops.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchAdminShops.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(fetchAdminShop.pending, (s) => { s.detailLoading = true; s.error = null; })
      .addCase(fetchAdminShop.fulfilled, (s, a) => { s.detailLoading = false; s.detail = a.payload; })
      .addCase(fetchAdminShop.rejected, (s, a) => { s.detailLoading = false; s.error = a.payload as string; })
      .addCase(updateAdminShopStatus.pending, (s) => { s.updating = true; })
      .addCase(updateAdminShopStatus.fulfilled, (s, a) => { s.updating = false; s.detail = a.payload; })
      .addCase(updateAdminShopStatus.rejected, (s) => { s.updating = false; })
      .addCase(setAdminShopFee.pending, (s) => { s.updating = true; })
      .addCase(setAdminShopFee.fulfilled, (s, a) => { s.updating = false; s.detail = a.payload; })
      .addCase(setAdminShopFee.rejected, (s) => { s.updating = false; });
  },
});

export default adminShopsSlice.reducer;
