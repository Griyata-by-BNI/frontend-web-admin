// types/sales.ts

export interface StatusMeta {
  code: number;
  message: string;
}

export interface ApiResponse<T> {
  status: StatusMeta;
  data: T;
}

/** Entitas Sales sesuai body pada Postman */
export interface Sales {
  id: number;
  npp: string;
  nama: string;
  email: string;
  performance: number; // contoh: 85.5  (dalam persen)
  target_skor: number; // contoh: 100
  region_id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSalesPayload {
  npp: string;
  full_name: string;
  email: string;
  performance: number;
  monthly_target: number;
  region_id: number;
  user_id: number;
}

/** Jika update-mu memang mengirim semua field, ubah ke Required<CreateSalesPayload> */
export type UpdateSalesPayload = Partial<CreateSalesPayload>;

/** Query params untuk list */
export type SortBy =
  | "npp"
  | "performance"
  | "monthly_target"
  | "created_at"
  | "updated_at";

export type SortOrder = "ASC" | "DESC";

export interface SalesQuery {
  pageNumber?: number;
  pageSize?: number;
  sort_by?: SortBy;
  sort_order?: SortOrder;
  search?: string;
  region_id?: number;
}

/** Bentuk respon list (sesuaikan dengan backend-mu jika berbeda) */
export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SalesListData {
  sales: Sales[];
  pagination?: PaginationMeta; // opsional jika backend belum mengembalikan
}

export type SalesListResponse = ApiResponse<SalesListData>;
export type SalesDetailResponse = ApiResponse<{ sales: Sales } | Sales>;

/** Performance & Analytics (fleksibel kalau skema belum final) */
export interface SalesPerformanceQuery {
  year: number;
  month: number;
}
export type SalesPerformanceData = Record<string, unknown>;
export type SalesPerformanceResponse = ApiResponse<SalesPerformanceData>;

/** Dropdowns */
export interface SelectOption {
  label: string;
  value: number | string;
}
export type RegionsSelectResponse = ApiResponse<
  { regions: SelectOption[] } | SelectOption[]
>;
export type SalesSelectResponse = ApiResponse<
  { sales: SelectOption[] } | SelectOption[]
>;
