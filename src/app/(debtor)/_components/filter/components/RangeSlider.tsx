import React from "react";
import { Form, Slider } from "antd";

interface RangeSliderProps {
  name: string;
  min: number;
  max: number;
  step: number;
  formatter: (value: number) => string;
  form: any;
}

export function RangeSlider({
  name,
  min,
  max,
  step,
  formatter,
  form,
}: RangeSliderProps) {
  return (
    <>
      <Form.Item name={name} className="!mb-0">
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
          const [minVal, maxVal] = form.getFieldValue(name) ?? [min, max];
          return (
            <div className="flex justify-between items-center text-gray-700">
              <span className="text-sm font-medium bg-gray-200 px-3 py-1.5 rounded-md">
                {formatter(minVal)}
              </span>
              <span className="text-sm font-medium bg-gray-200 px-3 py-1.5 rounded-md">
                {formatter(maxVal)}
              </span>
            </div>
          );
        }}
      </Form.Item>
    </>
  );
}
