import { FilterRanges } from '../types';

const defaultRanges: FilterRanges = {
  price: { min: 0, max: 10_000_000_000 },
  landArea: { min: 0, max: 1000 },
  buildingArea: { min: 0, max: 1000 },
  bedrooms: { min: 0, max: 10 },
  bathrooms: { min: 0, max: 10 },
  floors: { min: 0, max: 5 },
};

export function calculateRanges(properties: any[]): FilterRanges {
  const prices = properties.map((p) => p.price).filter(Boolean);
  const landAreas = properties
    .flatMap((p) => p.facilities?.find((f: any) => f.name === "LT")?.value || [])
    .filter(Boolean);
  const buildingAreas = properties
    .flatMap((p) => p.facilities?.find((f: any) => f.name === "LB")?.value || [])
    .filter(Boolean);
  const bedrooms = properties
    .flatMap((p) => p.facilities?.find((f: any) => f.name === "KT")?.value || [])
    .filter(Boolean);
  const bathrooms = properties
    .flatMap((p) => p.facilities?.find((f: any) => f.name === "KM")?.value || [])
    .filter(Boolean);
  const floors = properties
    .flatMap(
      (p) => p.facilities?.find((f: any) => f.name === "jumlahLantai")?.value || []
    )
    .filter(Boolean);

  return {
    price: {
      min: prices.length ? Math.min(...prices) : defaultRanges.price.min,
      max: prices.length ? Math.max(...prices) : defaultRanges.price.max,
    },
    landArea: {
      min: landAreas.length ? Math.min(...landAreas) : defaultRanges.landArea.min,
      max: landAreas.length ? Math.max(...landAreas) : defaultRanges.landArea.max,
    },
    buildingArea: {
      min: buildingAreas.length
        ? Math.min(...buildingAreas)
        : defaultRanges.buildingArea.min,
      max: buildingAreas.length
        ? Math.max(...buildingAreas)
        : defaultRanges.buildingArea.max,
    },
    bedrooms: {
      min: bedrooms.length ? Math.min(...bedrooms) : defaultRanges.bedrooms.min,
      max: bedrooms.length ? Math.max(...bedrooms) : defaultRanges.bedrooms.max,
    },
    bathrooms: {
      min: bathrooms.length ? Math.min(...bathrooms) : defaultRanges.bathrooms.min,
      max: bathrooms.length ? Math.max(...bathrooms) : defaultRanges.bathrooms.max,
    },
    floors: {
      min: floors.length ? Math.min(...floors) : defaultRanges.floors.min,
      max: floors.length ? Math.max(...floors) : defaultRanges.floors.max,
    },
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}