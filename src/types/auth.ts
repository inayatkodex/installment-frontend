export interface ShopLoginPayload {
  mobile: string;
  password: string;
  rememberMe?: boolean;
}

export interface ShopSignupPayload {
  shopName: string;
  city: string;
  address: string;
  ownerName: string;
  mobile: string;
  cnic: string;
  email?: string;
  password: string;
  profilePic?: string;
  documents?: {
    photo?: string;
    cnicFront?: string;
    cnicBack?: string;
    shopDocument?: string;
  };
}

export interface ShopUser {
  id: string;
  shopName: string;
  ownerName: string;
  mobile: string;
}

export interface ShopAuthState {
  user: ShopUser | null;
  access_token: string | null;
  loading: boolean;
  error: string | null;
}
