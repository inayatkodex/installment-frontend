import api from "@/store/ApiServices/api";
import API_URLS from "@/store/ApiServices/apiUrls";
import { getErrorMessage } from "@/shared/apiError";
import { CustomerDetail, CustomerListItem, NewCustomerPayload } from "@/types/customer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  list: CustomerListItem[];
  detail: CustomerDetail | null;
  loading: boolean;
  detailLoading: boolean;
  creating: boolean;
  error: string | null;
}
const initialState: State = { list: [], detail: null, loading: false, detailLoading: false, creating: false, error: null };

export const fetchCustomers = createAsyncThunk(
  "shopCustomers/fetchList",
  async (params: { search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get(API_URLS.SHOP.CUSTOMERS, { params });
      return res.data.data as CustomerListItem[];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Customers load nahi ho sake"));
    }
  },
);

export const fetchCustomerDetail = createAsyncThunk("shopCustomers/fetchDetail", async (id: string, { rejectWithValue }) => {
  try {
    const res = await api.get(API_URLS.SHOP.CUSTOMER_DETAIL(id));
    return res.data.data as CustomerDetail;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Customer ki detail load nahi ho saki"));
  }
});

export const createCustomer = createAsyncThunk("shopCustomers/create", async (payload: NewCustomerPayload, { rejectWithValue }) => {
  try {
    const res = await api.post(API_URLS.SHOP.CUSTOMERS, payload);
    return res.data.data as { id: string };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Customer save nahi ho saka"));
  }
});

/** Only customers whose installments are all paid can be deleted. */
export const deleteCustomer = createAsyncThunk("shopCustomers/delete", async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(API_URLS.SHOP.CUSTOMER_DETAIL(id));
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Customer delete nahi ho saka"));
  }
});

export const updateCustomer = createAsyncThunk(
  "shopCustomers/update",
  async (
    {
      id,
      name,
      fatherName,
      phone,
      cnic,
      address,
    }: {
      id: string;
      name?: string;
      fatherName?: string;
      phone?: string;
      cnic?: string;
      address?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(API_URLS.SHOP.CUSTOMER_DETAIL(id), {
        name,
        fatherName,
        phone,
        cnic,
        address,
      });
      return res.data.data as CustomerDetail;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Customer update nahi ho saka")
      );
    }
  }
);

export const uploadCustomerDocument = createAsyncThunk(
  "shopCustomers/uploadDocument",
  async ({ customerId, docKey, photo }: { customerId: string; docKey: string; photo: string }, { rejectWithValue }) => {
    try {
      await api.put(API_URLS.SHOP.CUSTOMER_DOCUMENT(customerId, docKey), { photo });
      return { customerId, docKey, photo };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Document save nahi ho saka"));
    }
  },
);

export const deleteCustomerDocument = createAsyncThunk(
  "shopCustomers/deleteDocument",
  async ({ customerId, docKey }: { customerId: string; docKey: string }, { rejectWithValue }) => {
    try {
      await api.delete(API_URLS.SHOP.CUSTOMER_DOCUMENT(customerId, docKey));
      return { customerId, docKey };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Document delete nahi ho saka"));
    }
  },
);

const shopCustomersSlice = createSlice({
  name: "shopCustomers",
  initialState,
  reducers: { clearCustomerDetail: (s) => { s.detail = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCustomers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchCustomers.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(fetchCustomerDetail.pending, (s) => { s.detailLoading = true; s.error = null; })
      .addCase(fetchCustomerDetail.fulfilled, (s, a) => { s.detailLoading = false; s.detail = a.payload; })
      .addCase(fetchCustomerDetail.rejected, (s, a) => { s.detailLoading = false; s.error = a.payload as string; })
      .addCase(deleteCustomer.fulfilled, (s, a) => { s.list = s.list.filter((c) => c.id !== a.payload); })
      .addCase(uploadCustomerDocument.fulfilled, (s, a) => {
        if (s.detail && s.detail.id === a.payload.customerId) {
          if (!s.detail.documents) s.detail.documents = {};
          s.detail.documents[a.payload.docKey as "cnicFront" | "cnicBack" | "other"] = a.payload.photo;
        }
      })
      .addCase(deleteCustomerDocument.fulfilled, (s, a) => {
        if (s.detail && s.detail.id === a.payload.customerId && s.detail.documents) {
          delete s.detail.documents[a.payload.docKey as "cnicFront" | "cnicBack" | "other"];
        }
      })
      .addCase(createCustomer.pending, (s) => { s.creating = true; })
      .addCase(createCustomer.fulfilled, (s) => { s.creating = false; })
      .addCase(createCustomer.rejected, (s) => { s.creating = false; })
      .addCase(updateCustomer.fulfilled, (s, a) => {
        if (s.detail && s.detail.id === a.payload.id) {
          s.detail = { ...s.detail, ...a.payload };
        }
        const idx = s.list.findIndex((c) => c.id === a.payload.id);
        if (idx >= 0) {
          s.list[idx] = {
            ...s.list[idx],
            name: a.payload.name,
            phone: a.payload.phone,
          };
        }
      });
  },
});

export const { clearCustomerDetail } = shopCustomersSlice.actions;
export default shopCustomersSlice.reducer;
