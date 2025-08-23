export type SortBy =
  | "latestUpdated"
  | "lowestPrice"
  | "closestDistance"
  | "highestPrice";

export interface FilterRanges {
  price: { min: number; max: number };
  landArea: { min: number; max: number };
  buildingArea: { min: number; max: number };
  bedrooms: { min: number; max: number };
  bathrooms: { min: number; max: number };
  floors: { min: number; max: number };
}

export interface FilterFormData {
  location?: string;
  propertyType?: string;
  price?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  landArea?: [number, number];
  buildingArea?: [number, number];
  sort?: SortBy;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filters: FilterFormData) => void;
  properties: any[];
  locationOptions: Array<{ value: string; label: string }>;
  propertyTypeOptions: Array<{ value: string; label: string }>;
}
