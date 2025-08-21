"use client";

import { useCreateSales } from "@/services/salesServices";
import { CreateSalesPayload } from "@/types/sales";
import { bniRegions } from "../constants";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateSalesModal() {
  const [form] = Form.useForm<CreateSalesPayload>();
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setModalOpen(false);
  };

  const createMut = useCreateSales();

  const handleSubmit = (values: CreateSalesPayload) => {
    createMut.mutate(values, {
      onSuccess: () => {
        message.success("Sales berhasil dibuat");
        handleCancel();
      },
      onError: () => message.error("Gagal membuat sales"),
    });
  };

  return (
    <>
      <Button
        type="primary"
        icon={<Plus className="w-4 h-4" />}
        onClick={() => setModalOpen(true)}
        loading={createMut.isPending}
      >
        Buat Data
      </Button>

      <Modal
        centered
        title={
          <Typography.Title level={5} className="!text-dark-tosca">
            Buat Data Sales
          </Typography.Title>
        }
        maskClosable={false}
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="Buat"
        okButtonProps={{ loading: createMut.isPending }}
        classNames={{ body: "!pt-2" }}
      >
        <Form<CreateSalesPayload>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="npp"
            label="NPP"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan NPP!" }]}
          >
            <Input placeholder="Contoh: NPP001" />
          </Form.Item>

          <Form.Item
            name="performance"
            label="Performance (%)"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon masukkan performance!" }]}
          >
            <InputNumber
              min={0}
              max={100}
              step={0.1}
              placeholder="0 - 100"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="target_skor"
            label="Monthly Target"
            className="!mb-3"
            rules={[
              { required: true, message: "Mohon masukkan monthly target!" },
            ]}
          >
            <InputNumber
              min={0}
              step={1}
              placeholder="Masukkan target bulanan"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="region_id"
            label="Wilayah"
            className="!mb-3"
            rules={[{ required: true, message: "Mohon pilih wilayah!" }]}
          >
            <Select
              placeholder="Pilih wilayah"
              options={bniRegions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item
            name="user_id"
            label="User ID"
            className="!mb-0"
            rules={[{ required: true, message: "Mohon masukkan User ID!" }]}
          >
            <InputNumber
              min={1}
              step={1}
              placeholder="Masukkan User ID"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
