import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { CollectionItem, ReceivedItem, ReceivePaymentPayload } from "@/types/payment";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State { items: CollectionItem[]; received: ReceivedItem[]; loading: boolean; error: string | null; receiving: boolean }
const initialState: State = { items: [], received: [], loading: false, error: null, receiving: false };

export const fetchTodayCollection = createAsyncThunk("shopCollection/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_URLS.SHOP.COLLECTION_TODAY);
    return res.data.data as CollectionItem[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Aaj ki list load nahi ho saki"));
  }
});

export const fetchTodayReceived = createAsyncThunk("shopCollection/fetchReceived", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get(API_URLS.SHOP.PAYMENTS_TODAY);
    return res.data.data as ReceivedItem[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Aaj ki payments load nahi ho sakin"));
  }
});

/** Undo a payment received today. The record is kept, only the amount is taken back. */
export const reversePayment = createAsyncThunk("shopCollection/reverse", async (id: string, { rejectWithValue }) => {
  try {
    await api.post(API_URLS.SHOP.REVERSE_PAYMENT(id));
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Payment wapas nahi ho saki"));
  }
});

/** Used by Today's Collection, Late Qistein and Customer profile. */
export const receivePayment = createAsyncThunk(
  "shopCollection/receive",
  async (payload: ReceivePaymentPayload, { rejectWithValue }) => {
    try {
      await api.post(API_URLS.SHOP.RECEIVE_PAYMENT, payload);
      return payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Raqam save nahi ho saki"));
    }
  },
);

const shopCollectionSlice = createSlice({
  name: "shopCollection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayCollection.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTodayCollection.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTodayCollection.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(fetchTodayReceived.fulfilled, (s, a) => { s.received = a.payload; })
      .addCase(receivePayment.pending, (s) => { s.receiving = true; })
      .addCase(receivePayment.fulfilled, (s) => { s.receiving = false; })
      .addCase(receivePayment.rejected, (s) => { s.receiving = false; });
  },
});

export default shopCollectionSlice.reducer;
