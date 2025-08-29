import { Collapse, Row, Col } from "antd";
import React, { useMemo } from "react";
import { NearbyPlaceTypeLabel } from "../../../constants";

type NearbyPlace = { name: string; distance?: number | null };
type NearbyCategory = { type: string; places: NearbyPlace[] };

const formatDistance = (m?: number | null) => {
  if (m == null || Number.isNaN(m)) return "";
  if (m >= 1000) {
    const km = m / 1000;
    const isInt = Number.isInteger(km);
    return `${isInt ? km.toFixed(0) : km.toFixed(1)} km`;
  }
  return `${m} m`;
};

const nearbyPlacesArray = (raw: unknown): NearbyCategory[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as NearbyCategory[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as NearbyCategory[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

export function NearbyPlacesCollapse({ cluster }: { cluster: any }) {
  const categories = useMemo(
    () => nearbyPlacesArray(cluster?.nearbyPlaces),
    [cluster?.nearbyPlaces]
  );

  const items = [
    {
      key: "1",
      label: "Tempat Terdekat",
      children: (
        <Row gutter={[12, 12]}>
          {categories
            .filter((c) => Array.isArray(c?.places) && c.places.length > 0)
            .map((category, idx) => (
              <Col xs={24} md={12} lg={8} key={`${category.type}-${idx}`}>
                <p className="text-xs font-medium text-gray-700 mb-1">
                  {NearbyPlaceTypeLabel[category.type] ?? category.type}:
                </p>

                {category.places.map((place, idx2) => {
                  const dist = formatDistance(
                    typeof place.distance === "string"
                      ? Number(place.distance)
                      : place.distance ?? undefined
                  );
                  return (
                    <p key={idx2} className="text-xs text-gray-600">
                      • {place.name}
                      {dist ? ` (${dist})` : ""}
                    </p>
                  );
                })}
              </Col>
            ))}

          {categories.every((c) => !c?.places?.length) && (
            <Col span={24}>
              <p className="text-xs text-gray-500">
                Belum ada data tempat terdekat.
              </p>
            </Col>
          )}
        </Row>
      ),
    },
  ];

  return (
    <Collapse defaultActiveKey={["1"]} expandIconPosition="end" items={items} />
  );
}
