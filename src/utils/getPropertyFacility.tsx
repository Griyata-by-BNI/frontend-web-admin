import { ExploreProperty } from "@/types/explore";

interface Facility {
  name: "KT" | "KM" | "LB" | "LT";
  value: number;
}

const getPropertyFacility = (
  property: ExploreProperty,
  name: Facility["name"]
): number | string => {
  const facility = property.facilities.find((f) => f.name === name);
  return facility && typeof facility.value === "number"
    ? facility.value
    : "N/A";
};

export default getPropertyFacility;
