// services/salesServices.ts
import { axiosInstance } from "@/utils/axios";
import {
  ApiResponse,
  CreateSalesPayload,
  RegionsSelectResponse,
  Sales,
  SalesDetailResponse,
  SalesListResponse,
  SalesPerformanceQuery,
  SalesPerformanceResponse,
  SalesQuery,
  SalesSelectResponse,
  UpdateSalesPayload,
} from "@/types/sales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** GET: list */
export const getSales = async (
  params?: SalesQuery
): Promise<SalesListResponse> => {
  const { data } = await axiosInstance.get<SalesListResponse>("/sales", {
    params,
  });
  return data;
};

/** GET: detail by id */
export const getSalesById = async (
  salesId: number | string
): Promise<SalesDetailResponse> => {
  const { data } = await axiosInstance.get<SalesDetailResponse>(
    `/sales/${salesId}`
  );
  return data;
};

/** POST: create */
export const createSales = async (
  payload: CreateSalesPayload
): Promise<ApiResponse<{ sales: Sales } | Sales>> => {
  const { data } = await axiosInstance.post<
    ApiResponse<{ sales: Sales } | Sales>
  >("/sales", payload);
  return data;
};

/** PUT: update */
export const updateSales = async (
  salesId: number | string,
  payload: UpdateSalesPayload
): Promise<ApiResponse<{ sales: Sales } | Sales>> => {
  const { data } = await axiosInstance.put<
    ApiResponse<{ sales: Sales } | Sales>
  >(`/sales/${salesId}`, payload);
  return data;
};

/** DELETE: delete */
export const deleteSales = async (
  salesId: number | string
): Promise<ApiResponse<null | Record<string, unknown>>> => {
  const { data } = await axiosInstance.delete<
    ApiResponse<null | Record<string, unknown>>
  >(`/sales/${salesId}`);
  return data;
};

/** GET: performance */
export const getSalesPerformance = async (
  salesId: number | string,
  query: SalesPerformanceQuery
): Promise<SalesPerformanceResponse> => {
  const { data } = await axiosInstance.get<SalesPerformanceResponse>(
    `/sales/${salesId}/performance`,
    { params: query }
  );
  return data;
};

/** GET: sales select (by optional region) */
export const getSalesSelect = async (
  region_id?: number
): Promise<SalesSelectResponse> => {
  const { data } = await axiosInstance.get<SalesSelectResponse>(
    "/sales/select",
    { params: { region_id } }
  );
  return data;
};

/** Keys */
export const salesKeys = {
  all: ["sales"] as const,
  list: (params?: SalesQuery) =>
    [...salesKeys.all, "list", params ?? {}] as const,
  detail: (id: number | string) => [...salesKeys.all, "detail", id] as const,
  performance: (id: number | string, qp: SalesPerformanceQuery) =>
    [...salesKeys.all, "performance", id, qp] as const,
  regionsSelect: ["sales", "regions", "select"] as const,
  salesSelect: (region_id?: number) =>
    ["sales", "select", region_id ?? "all"] as const,
};

/** GET: list */
export const useSales = (params?: SalesQuery) => {
  return useQuery<SalesListResponse>({
    queryKey: salesKeys.list(params),
    queryFn: () => getSales(params),
  });
};

/** GET: detail */
export const useSalesById = (salesId?: number | string) => {
  return useQuery<SalesDetailResponse>({
    queryKey: salesKeys.detail(salesId ?? "unknown"),
    queryFn: () => {
      if (salesId == null) throw new Error("salesId is required");
      return getSalesById(salesId);
    },
    enabled: salesId != null,
  });
};

/** POST: create */
export const useCreateSales = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSalesPayload) => createSales(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesKeys.all });
    },
  });
};

/** PUT: update */
export const useUpdateSales = () => {
  const qc = useQueryClient();
  return useMutation({
    // satu argumen untuk mutationFn
    mutationFn: (vars: {
      salesId: number | string;
      payload: UpdateSalesPayload;
    }) => updateSales(vars.salesId, vars.payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: salesKeys.list() });
      qc.invalidateQueries({ queryKey: salesKeys.detail(vars.salesId) });
    },
  });
};

/** DELETE: delete */
export const useDeleteSales = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (salesId: number | string) => deleteSales(salesId),
    onSuccess: (_data, salesId) => {
      qc.invalidateQueries({ queryKey: salesKeys.list() });
      qc.invalidateQueries({ queryKey: salesKeys.detail(salesId) });
    },
  });
};

/** GET: performance */
export const useSalesPerformance = (
  salesId?: number | string,
  qp?: SalesPerformanceQuery
) => {
  return useQuery<SalesPerformanceResponse>({
    queryKey: qp
      ? salesKeys.performance(salesId ?? "unknown", qp)
      : ["sales", "performance", "unknown"],
    queryFn: () => {
      if (salesId == null || qp == null)
        throw new Error("salesId & query params are required");
      return getSalesPerformance(salesId, qp);
    },
    enabled: salesId != null && qp != null,
  });
};

/** GET: sales select (by region) */
export const useSalesSelect = (region_id?: number) => {
  return useQuery<SalesSelectResponse>({
    queryKey: salesKeys.salesSelect(region_id),
    queryFn: () => getSalesSelect(region_id),
  });
};
