export interface AdminLoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  access_token: string | null;
  loading: boolean;
  error: string | null;
}
