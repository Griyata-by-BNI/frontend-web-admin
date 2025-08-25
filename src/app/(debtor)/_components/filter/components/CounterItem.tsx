import React from "react";
import { Form, InputNumber, Button } from "antd";
import { Minus, Plus } from "lucide-react";

interface CounterItemProps {
  label: string;
  name: string;
  icon: React.ReactNode;
  min?: number;
  max?: number;
}

export function CounterItem({
  label,
  name,
  icon,
  min = 0,
  max = 99,
}: CounterItemProps) {
  const form = Form.useFormInstance();
  const value = Form.useWatch(name, form);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const handleDelta = (delta: number) => {
    const current = Number(form.getFieldValue(name) ?? 0);
    const next = clamp(current + delta);
    form.setFieldsValue({ [name]: next });
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label={`Kurangi ${label}`}
          onClick={() => handleDelta(-1)}
          disabled={(value ?? 0) <= min}
          className="w-10 !h-[32px]"
          icon={<Minus className="pt-2 w-5 h-5" />}
        />

        <Form.Item name={name} className="!mb-0 flex-1">
          <InputNumber
            min={min}
            max={max}
            step={1}
            placeholder="0"
            className="!w-full"
            controls={false}
          />
        </Form.Item>

        <Button
          aria-label={`Tambah ${label}`}
          onClick={() => handleDelta(1)}
          disabled={(value ?? 0) >= max}
          className="w-10 !h-[32px]"
          icon={<Plus className="pt-2 w-5 h-5" />}
        />
      </div>
    </div>
  );
}
