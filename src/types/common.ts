export type ShopStatus = "pending" | "active" | "inactive" | "archived";
export type InstallmentStatus = "paid" | "pending" | "overdue" | "partial";

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
