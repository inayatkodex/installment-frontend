import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { StatusReport } from "@/types/payment";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  data: StatusReport | null;
  loading: boolean;
  error: string | null;
}
const initialState: State = { data: null, loading: false, error: null };

export const fetchStatus = createAsyncThunk(
  "shopStatus/fetch",
  async (month: string, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.SHOP.STATUS, { params: { month } });
      return res.data.data as StatusReport;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Status load nahi ho saka"),
      );
    }
  },
);

const shopStatusSlice = createSlice({
  name: "shopStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatus.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStatus.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload;
      })
      .addCase(fetchStatus.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload as string;
      });
  },
});

export default shopStatusSlice.reducer;
