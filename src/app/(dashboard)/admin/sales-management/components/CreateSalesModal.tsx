"use client";

import { Form, Input, InputNumber, Modal, Select, Typography } from "antd";
import type { Sales } from "../types";

interface CreateSalesModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Sales, "id">) => void;
}

export default function CreateSalesModal({
  open,
  onCancel,
  onSubmit,
}: CreateSalesModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Buat Data Sales
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Buat"
      classNames={{ body: "!pt-2" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nama"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan nama!" }]}
        >
          <Input placeholder="Masukkan nama lengkap" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          className="!mb-3"
          rules={[
            {
              required: true,
              type: "email",
              message: "Mohon masukkan email yang valid!",
            },
          ]}
        >
          <Input placeholder="contoh@perusahaan.com" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Nomor Telepon"
          className="!mb-3"
          rules={[
            { required: true, message: "Mohon masukkan nomor telepon!" },
            {
              pattern: /^[0-9+\-\s()]+$/,
              message: "Mohon masukkan nomor telepon yang valid!",
            },
            { min: 10, message: "Nomor telepon minimal 10 digit!" },
          ]}
        >
          <Input placeholder="081234567890" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Jenis Kelamin"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon pilih jenis kelamin!" }]}
        >
          <Select placeholder="Pilih jenis kelamin">
            <Select.Option value="Male">Laki-laki</Select.Option>
            <Select.Option value="Female">Perempuan</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Alamat"
          className="!mb-3"
          rules={[
            { required: true, message: "Mohon masukkan alamat!" },
            { min: 5, message: "Alamat minimal 5 karakter!" },
          ]}
        >
          <Input placeholder="Masukkan kota atau wilayah" />
        </Form.Item>

        <Form.Item
          name="target_score"
          label="Target Skor"
          className="!mb-3"
          rules={[{ required: true, message: "Mohon masukkan target skor!" }]}
        >
          <InputNumber
            min={0}
            max={100}
            placeholder="Masukkan skor (0-100)"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
