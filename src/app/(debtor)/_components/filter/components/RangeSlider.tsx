import React from "react";
import { Form, Slider, InputNumber } from "antd";

interface RangeSliderProps {
  name: string;
  min: number;
  max: number;
  step: number;
  formatter: (value: number) => string;
  form: any;
  prefix?: string;
}

export function RangeSlider({
  name,
  min,
  max,
  step,
  formatter,
  form,
  prefix,
}: RangeSliderProps) {
  return (
    <>
      <Form.Item name={name} className="!mb-0" initialValue={[min, max]}>
        <Slider
          range
          min={min}
          max={max}
          step={step}
          tooltip={{ formatter: (v) => formatter(v as number) }}
        />
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {() => {
          const fieldValue = form.getFieldValue(name);
          const [minVal, maxVal] = fieldValue && Array.isArray(fieldValue) ? fieldValue : [min, max];

          // Hitung lebar berbasis karakter terpanjang dari kandidat nilai
          const calcWidth = (...nums: Array<number | undefined>) => {
            const lengths = nums
              .filter(
                (n): n is number => typeof n === "number" && !Number.isNaN(n)
              )
              .map((n) => String(formatter(n)).length);

            const ch = Math.max(6, ...lengths); // minimal 6ch biar nggak terlalu kecil
            return `calc(${ch}ch + 1.75rem)`; // buffer padding + border
          };

          return (
            <div className="flex justify-between items-center gap-2 text-gray-700">
              {/* MIN input → lebar mengikuti kandidat terpanjang antara min & maxVal */}
              <InputNumber
                min={min}
                max={maxVal}
                prefix={prefix}
                value={minVal}
                onChange={(val) => {
                  const current = form.getFieldValue(name);
                  const currentValue = current && Array.isArray(current) ? current : [min, max];
                  form.setFieldsValue({ [name]: [val ?? min, currentValue[1]] });
                }}
                formatter={(val) => formatter(val as number)}
                parser={(val) => {
                  const cleaned = val?.replace(/[^\d]/g, "");
                  return cleaned ? parseInt(cleaned, 10) : undefined;
                }}
                controls={false}
                size="small"
                className="text-sm"
                style={{ width: calcWidth(min, maxVal, minVal) }}
              />

              <span className="text-xs text-gray-500">-</span>

              {/* MAX input → lebar mengikuti kandidat terpanjang antara max & minVal */}
              <InputNumber
                min={minVal}
                max={max}
                prefix={prefix}
                value={maxVal}
                onChange={(val) => {
                  const current = form.getFieldValue(name);
                  const currentValue = current && Array.isArray(current) ? current : [min, max];
                  form.setFieldsValue({ [name]: [currentValue[0], val ?? max] });
                }}
                formatter={(val) => formatter(val as number)}
                parser={(val) => {
                  const cleaned = val?.replace(/[^\d]/g, "");
                  return cleaned ? parseInt(cleaned, 10) : undefined;
                }}
                controls={false}
                size="small"
                className="text-sm"
                style={{ width: calcWidth(max, minVal, maxVal) }}
              />
            </div>
          );
        }}
      </Form.Item>
    </>
  );
}
