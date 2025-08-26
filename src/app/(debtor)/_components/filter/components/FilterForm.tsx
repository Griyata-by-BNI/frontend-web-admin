"use client";

import {
  faBed,
  faChartArea,
  faHome,
  faMoneyBillWave,
  faShower,
  faStairs,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Radio, Row, Col, App, Grid } from "antd";
import { formatRupiah } from "../utils/filterUtils";

const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
import { CounterItem } from "./CounterItem";
import { FilterSection } from "./FilterSection";
import { RangeSlider } from "./RangeSlider";
import { useCallback, useEffect } from "react";

export function FilterForm() {
  const { message } = App.useApp();
  const form = Form.useFormInstance();

  const sortBy = Form.useWatch("sortBy", form);
  const lat = Form.useWatch("lat", form);
  const lng = Form.useWatch("lng", form);

  const GEO_MSG_KEY = "geo-denied";

  const showGeoDenied = useCallback(() => {
    message.open({
      key: GEO_MSG_KEY,
      type: "error",
      content:
        "Mohon izinkan akses lokasi untuk memilih filter jarak terdekat!",
      duration: 3,
    });
  }, [message]);

  const fallbackToLatest = useCallback(() => {
    form.setFieldsValue({
      sortBy: "latestUpdated",
      lat: undefined,
      lng: undefined,
    });

    showGeoDenied();
  }, [form, message]);

  const requestLocation = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return false;
    }

    try {
      if ("permissions" in navigator && (navigator as any).permissions?.query) {
        const status = await (navigator as any).permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (status.state === "denied") return false;
      }
    } catch {}

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = pos.coords;
      form.setFieldsValue({ lat: latitude, lng: longitude });
      return true;
    } catch {
      return false;
    }
  }, [form]);

  useEffect(() => {
    if (sortBy !== "closestDistance") return;
    if (lat != null && lng != null) return;

    (async () => {
      const ok = await requestLocation();

      if (!ok) fallbackToLatest();
    })();
  }, [sortBy, lat, lng, requestLocation, fallbackToLatest]);

  const handleSortChange = useCallback(
    async (e: any) => {
      const value = e.target?.value;
      if (value !== "closestDistance") return;

      const ok = await requestLocation();

      if (!ok) {
        fallbackToLatest();
      }
    },
    [requestLocation, fallbackToLatest]
  );

  const screens = Grid.useBreakpoint();

  return (
    <div className="flex flex-col gap-2">
      <Form.Item name="lat" hidden initialValue={undefined}>
        <input type="hidden" />
      </Form.Item>
      <Form.Item name="lng" hidden initialValue={undefined}>
        <input type="hidden" />
      </Form.Item>

      {/* Sort By */}
      <FilterSection
        icon={
          <FontAwesomeIcon
            icon={faArrowDownWideShort}
            className="text-teal-600 w-5"
          />
        }
        title="Urutkan"
      >
        <Form.Item name="sortBy" initialValue="latestUpdated" className="!mb-0">
          <Radio.Group
            optionType={screens.md ? "button" : "default"}
            buttonStyle="solid"
            onChange={handleSortChange}
          >
            <Radio.Button value="latestUpdated">Terbaru</Radio.Button>
            <Radio.Button value="lowestPrice">Harga Terendah</Radio.Button>
            <Radio.Button value="highestPrice">Harga Tertinggi</Radio.Button>
            <Radio.Button value="closestDistance">Jarak Terdekat</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        icon={
          <FontAwesomeIcon
            icon={faMoneyBillWave}
            className="text-teal-600 w-5"
          />
        }
        title="Rentang Harga"
      >
        <RangeSlider
          name="price"
          min={0}
          max={50_000_000_000}
          step={100_000}
          formatter={formatNumber}
          form={form}
          prefix="Rp"
        />
      </FilterSection>

      {/* Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CounterItem
          label="Kamar Tidur"
          name="bedrooms"
          icon={<FontAwesomeIcon icon={faBed} className="text-teal-600 w-5" />}
          min={0}
          max={100}
        />
        <CounterItem
          label="Kamar Mandi"
          name="bathrooms"
          icon={
            <FontAwesomeIcon icon={faShower} className="text-teal-600 w-5" />
          }
          min={0}
          max={100}
        />
        <CounterItem
          label="Jumlah Lantai"
          name="floors"
          icon={
            <FontAwesomeIcon icon={faStairs} className="text-teal-600 w-5" />
          }
          min={0}
          max={100}
        />
      </div>

      {/* Land & Building Area side-by-side on md, full width on xs */}
      <Row gutter={[32, 16]}>
        <Col xs={24} md={12}>
          <FilterSection
            icon={
              <FontAwesomeIcon
                icon={faChartArea}
                className="text-teal-600 w-5"
              />
            }
            title="Luas Tanah (m²)"
          >
            <RangeSlider
              name="landArea"
              min={0}
              max={1000}
              step={Math.max(1, Math.floor(1000 / 50))}
              formatter={(v) => `${v} m²`}
              form={form}
            />
          </FilterSection>
        </Col>

        <Col xs={24} md={12}>
          <FilterSection
            icon={
              <FontAwesomeIcon icon={faHome} className="text-teal-600 w-5" />
            }
            title="Luas Bangunan (m²)"
          >
            <RangeSlider
              name="buildingArea"
              min={0}
              max={1000}
              step={Math.max(1, Math.floor(1000 / 50))}
              formatter={(v) => `${v} m²`}
              form={form}
            />
          </FilterSection>
        </Col>
      </Row>
    </div>
  );
}
