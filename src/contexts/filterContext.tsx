"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Form } from "antd";
import type { FormInstance } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import { FilterFormData } from "@/app/(debtor)/_components/filter";
import { SortBy } from "@/app/(debtor)/_components/filter/types";
import { useRouter } from "@bprogress/next";

type FilterContextValue = {
  form: FormInstance<FilterFormData>;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;

  router: ReturnType<typeof useRouter>;
  pathname: string;
  searchParams: ReturnType<typeof useSearchParams>;

  handleSearch: (values: FilterFormData) => Promise<void>;
  buildSearchParams: (values: FilterFormData) => URLSearchParams;
  handleReset: () => void;
  initialValues: FilterFormData;
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const isSort = (v: string | null): v is SortBy =>
  !!v &&
  ["latestUpdated", "lowestPrice", "closestDistance", "highestPrice"].includes(
    v
  );

const normalizeSort = (
  sortBy: SortBy | undefined,
  lat?: number,
  lng?: number
): SortBy => {
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  if (sortBy === "closestDistance" && !hasCoords) return "latestUpdated";
  return sortBy ?? "latestUpdated";
};

export const FilterProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [form] = Form.useForm<FilterFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setIf = useCallback(
    (params: URLSearchParams, key: string, v: unknown) => {
      const isEmpty =
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "");
      if (isEmpty) params.delete(key);
      else params.set(key, String(v));
    },
    []
  );

  const setRange = useCallback(
    (params: URLSearchParams, prefix: string, range?: [number, number]) => {
      const minKey = `${prefix}Min`;
      const maxKey = `${prefix}Max`;
      if (!range || range.length !== 2) {
        params.delete(minKey);
        params.delete(maxKey);
        return;
      }
      const [min, max] = range;
      setIf(params, minKey, Number.isFinite(min) ? min : undefined);
      setIf(params, maxKey, Number.isFinite(max) ? max : undefined);
    },
    [setIf]
  );

  const FILTER_KEYS_TO_CHECK = [
    "search",
    "location",
    "propertyType",
    "bedrooms",
    "bathrooms",
    "floors",
    "sortBy",
    "lat",
    "lng",
    "priceMin",
    "priceMax",
    "landAreaMin",
    "landAreaMax",
    "buildingAreaMin",
    "buildingAreaMax",
    "pageSize", // kalau size berubah, reset page juga
  ];

  const buildSearchParams = useCallback(
    (values: FilterFormData) => {
      const curr = searchParams;
      const next = new URLSearchParams(curr.toString());

      const normalizedSort = normalizeSort(
        values.sortBy,
        values.lat,
        values.lng
      );

      setIf(next, "location", values.location);
      setIf(next, "propertyType", values.propertyType);
      setIf(next, "bedrooms", values.bedrooms);
      setIf(next, "bathrooms", values.bathrooms);
      setIf(next, "floors", values.floors);
      setIf(next, "sortBy", normalizedSort);
      setIf(next, "search", values.search);
      setIf(next, "lat", values.lat);
      setIf(next, "lng", values.lng);

      setRange(next, "price", values.price);
      setRange(next, "landArea", values.landArea);
      setRange(next, "buildingArea", values.buildingArea);

      const shouldResetPage = FILTER_KEYS_TO_CHECK.some((k) => {
        const beforeVal = curr.get(k) ?? "";
        const afterVal = next.get(k) ?? "";
        return beforeVal !== afterVal;
      });

      if (shouldResetPage) {
        next.set("pageNumber", "1");
      }

      return next;
    },
    [searchParams, setIf, setRange]
  );

  const handleSearch = useCallback(
    async (values: FilterFormData) => {
      setIsLoading(true);
      try {
        const next = buildSearchParams(values);
        const url = `${
          !pathname.includes("search") ? pathname + "/search" : pathname
        }?${next.toString()}`;
        router.push(url, { disableSameURL: false });
      } finally {
        setIsLoading(false);
      }
    },
    [pathname, router, buildSearchParams]
  );

  const handleReset = useCallback(() => {
    form.resetFields();
  }, [form]);

  const getNum = useCallback(
    (k: string) => {
      const v = searchParams.get(k);
      if (v === null || v.trim() === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    },
    [searchParams]
  );

  const getStr = useCallback(
    (k: string) => {
      const v = searchParams.get(k);
      return v ?? undefined;
    },
    [searchParams]
  );

  const getRange = useCallback(
    (prefix: string): [number, number] | undefined => {
      const min = getNum(`${prefix}Min`);
      const max = getNum(`${prefix}Max`);

      if (min === undefined || max === undefined) return undefined;
      return [min, max];
    },
    [getNum]
  );

  const initialValues = useMemo<FilterFormData>(() => {
    return {
      // string input native -> paksa "", lainnya undefined jika tak ada
      search: searchParams.get("search") ?? "",
      location: getStr("location"),
      propertyType: getStr("propertyType"),
      sortBy: isSort(searchParams.get("sortBy"))
        ? (searchParams.get("sortBy") as SortBy)
        : "latestUpdated",

      bedrooms: getNum("bedrooms"),
      bathrooms: getNum("bathrooms"),
      floors: getNum("floors"),

      price: getRange("price"),
      landArea: getRange("landArea"),
      buildingArea: getRange("buildingArea"),

      lat: getNum("lat"),
      lng: getNum("lng"),
    };
  }, [searchParams, getStr, getNum, getRange]);

  const value: FilterContextValue = {
    form,
    isLoading,
    setIsLoading,
    router,
    pathname,
    searchParams,
    handleSearch,
    buildSearchParams,
    handleReset,
    initialValues,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const ctx = useContext(FilterContext);
  if (!ctx)
    throw new Error("useFilterContext must be used within <FilterProvider>");
  return ctx;
};
