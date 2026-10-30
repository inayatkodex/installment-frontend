import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import {
  AdminShop,
  AdminShopsResponse,
  PendingShopDeletion,
} from "@/types/adminShop";
import { ShopStatus } from "@/types/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  list: AdminShopsResponse | null;
  detail: AdminShop | null;
  pendingDeletion: PendingShopDeletion[];
  loading: boolean;
  detailLoading: boolean;
  updating: boolean;
  error: string | null;
}
const initialState: State = { list: null, detail: null, pendingDeletion: [], loading: false, detailLoading: false, updating: false, error: null };

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

export const fetchPendingShopDeletions = createAsyncThunk(
  "adminShops/fetchPendingDeletion",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.ADMIN.SHOPS_PENDING_DELETION);
      return res.data.data as PendingShopDeletion[];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load pending shop deletions"));
    }
  },
);

export const undoDeleteAdminShop = createAsyncThunk(
  "adminShops/undoDelete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.post(API_URLS.ADMIN.SHOP_UNDO_DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to restore shop"));
    }
  },
);

export const deleteAdminShop = createAsyncThunk(
  "adminShops/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(API_URLS.ADMIN.SHOP_DELETE(id));
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete shop"));
    }
  },
);

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
  async (payload: { id: string; month: string; status: "paid" | "unpaid"; method?: string }, { rejectWithValue }) => {
    try {
      const res = await api.patch(API_URLS.ADMIN.SHOP_FEE(payload.id), {
        month: payload.month,
        status: payload.status,
        method: payload.method,
      });
      return res.data.data as AdminShop;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update fee status"));
    }
  },
);

export const resetAdminShopPassword = createAsyncThunk(
  "adminShops/resetPassword",
  async (payload: { id: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await api.patch(API_URLS.ADMIN.SHOP_PASSWORD(payload.id), {
        newPassword: payload.newPassword,
      });
      return payload.id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to reset shop password"));
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
      .addCase(fetchPendingShopDeletions.fulfilled, (s, a) => { s.pendingDeletion = a.payload; })
      .addCase(fetchPendingShopDeletions.rejected, (s, a) => { s.error = a.payload as string; })
      .addCase(deleteAdminShop.pending, (s) => { s.updating = true; })
      .addCase(deleteAdminShop.fulfilled, (s, a) => {
        s.updating = false;
        if (s.detail?.id === a.payload) s.detail = null;
        if (s.list) {
          const deleted = s.list.items.find((item) => item.id === a.payload);
          s.list.items = s.list.items.filter((item) => item.id !== a.payload);
          if (deleted) {
            s.list.total = Math.max(0, s.list.total - 1);
            s.list.counts.all = Math.max(0, s.list.counts.all - 1);
            s.list.counts[deleted.status] = Math.max(
              0,
              s.list.counts[deleted.status] - 1,
            );
          }
        }
      })
      .addCase(undoDeleteAdminShop.pending, (s) => { s.updating = true; })
      .addCase(undoDeleteAdminShop.fulfilled, (s, a) => {
        s.updating = false;
        s.pendingDeletion = s.pendingDeletion.filter((shop) => shop.id !== a.payload);
      })
      .addCase(undoDeleteAdminShop.rejected, (s) => { s.updating = false; })
      .addCase(deleteAdminShop.rejected, (s) => { s.updating = false; })
      .addCase(updateAdminShopStatus.pending, (s) => { s.updating = true; })
      .addCase(updateAdminShopStatus.fulfilled, (s, a) => {
        s.updating = false;
        s.detail = a.payload;
        if (s.list?.items) {
          const idx = s.list.items.findIndex((item) => item.id === a.payload.id);
          if (idx !== -1) {
            s.list.items[idx] = a.payload;
          }
        }
      })
      .addCase(updateAdminShopStatus.rejected, (s) => { s.updating = false; })
      .addCase(setAdminShopFee.pending, (s) => { s.updating = true; })
      .addCase(setAdminShopFee.fulfilled, (s, a) => {
        s.updating = false;
        s.detail = a.payload;
        if (s.list?.items) {
          const idx = s.list.items.findIndex((item) => item.id === a.payload.id);
          if (idx !== -1) {
            s.list.items[idx] = a.payload;
          }
        }
      })
      .addCase(setAdminShopFee.rejected, (s) => { s.updating = false; })
      .addCase(resetAdminShopPassword.pending, (s) => { s.updating = true; })
      .addCase(resetAdminShopPassword.fulfilled, (s) => { s.updating = false; })
      .addCase(resetAdminShopPassword.rejected, (s) => { s.updating = false; });
  },
});

export default adminShopsSlice.reducer;
