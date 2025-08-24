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
import { Form, Radio, Row, Col, App } from "antd";
import { formatRupiah } from "../utils/filterUtils";
import { CounterItem } from "./CounterItem";
import { FilterSection } from "./FilterSection";
import { RangeSlider } from "./RangeSlider";
import { useEffect } from "react";

export function FilterForm() {
  const { message } = App.useApp();
  const form = Form.useFormInstance();
  const sort = Form.useWatch("sort", form) ?? Form.useWatch("sortBy", form);

  useEffect(() => {
    if (sort !== "closestDistance") {
      form.setFieldsValue({ lat: undefined, lng: undefined });
      return;
    }

    // Ambil posisi user saat ini
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      // Tidak didukung
      form.setFieldsValue({ lat: undefined, lng: undefined });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        form.setFieldsValue({ lat: latitude, lng: longitude });
      },
      () => {
        // Ditolak / gagal
        form.setFieldsValue({
          lat: undefined,
          lng: undefined,
          sortBy: "latestUpdated",
        });

        message.error(
          "Mohon izinkan akses lokasi untuk memilih filter jarak terdekat!"
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [sort, form]);

  return (
    <div className="flex flex-col gap-2">
      <Form.Item name="lat" hidden>
        <input type="hidden" />
      </Form.Item>
      <Form.Item name="lng" hidden>
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
          <Radio.Group optionType="button" buttonStyle="solid">
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
          max={1_000_000_000_000}
          step={Math.max(1_000_000, Math.floor(1_000_000_000_000 / 1000))}
          formatter={formatRupiah}
          form={form}
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
