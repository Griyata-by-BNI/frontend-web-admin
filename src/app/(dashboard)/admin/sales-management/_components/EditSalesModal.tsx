"use client";

import { useUpdateSales } from "@/services/salesServices";
import { bniRegions } from "../constants";
import type { Sales, UpdateSalesPayload } from "@/types/sales";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

interface EditSalesModalProps {
  record: Sales;
}

export default function EditSalesModal({ record }: EditSalesModalProps) {
  const [form] = Form.useForm<UpdateSalesPayload>();
  const { message } = App.useApp();
  const updateMut = useUpdateSales();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      npp: record.npp,
      monthly_target: record.target_skor,
      region_id: record.region_id,
    });
  }, [open, record, form]);

  const handleSubmit = (values: UpdateSalesPayload) => {
    updateMut.mutate(
      { salesId: record.id, payload: values },
      {
        onSuccess: () => {
          message.success("Sales berhasil diperbarui");
          form.resetFields();
          setOpen(false);
        },
        onError: () => message.error("Gagal memperbarui sales"),
      }
    );
  };

  return (
    <>
      <Tooltip title="Edit Data">
        <Button
          icon={<Edit className="w-4 h-4" />}
          onClick={() => setOpen(true)}
        />
      </Tooltip>

      <Modal
        centered
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Edit Data Sales
          </Typography.Title>
        }
        maskClosable={false}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Perbarui"
        okButtonProps={{ loading: updateMut.isPending }}
        classNames={{ body: "!pt-2" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="npp"
            label="NPP"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan NPP!" }]}
          >
            <Input placeholder="Contoh: NPP001" />
          </Form.Item>

          <Form.Item
            name="monthly_target"
            label="Monthly Target"
            className="!mb-3"
          >
            <InputNumber
              min={0}
              step={1}
              placeholder="Masukkan target bulanan (opsional)"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="region_id"
            label="Wilayah"
            className="!mb-0"
            rules={[{ required: true, message: "Mohon pilih wilayah!" }]}
          >
            <Select
              placeholder="Pilih wilayah"
              options={bniRegions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
