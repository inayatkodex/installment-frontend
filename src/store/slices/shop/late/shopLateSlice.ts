import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { LateItem } from "@/types/payment";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  items: LateItem[];
  loading: boolean;
  error: string | null;
}
const initialState: State = { items: [], loading: false, error: null };

export const fetchLate = createAsyncThunk(
  "shopLate/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.SHOP.LATE);
      return res.data.data as LateItem[];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Late qistein load nahi ho sakin"),
      );
    }
  },
);

const shopLateSlice = createSlice({
  name: "shopLate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLate.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchLate.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchLate.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export default shopLateSlice.reducer;
