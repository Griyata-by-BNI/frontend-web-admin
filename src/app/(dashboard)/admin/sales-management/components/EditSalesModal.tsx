"use client";

import { Form, Input, InputNumber, Modal, Select, Typography } from "antd";
import { useEffect } from "react";
import type { Sales } from "../types";

interface EditSalesModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Sales) => void;
  editingRecord: Sales | null;
}

export default function EditSalesModal({
  open,
  onCancel,
  onSubmit,
  editingRecord,
}: EditSalesModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue(editingRecord);
    }
  }, [editingRecord, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      centered
      title={
        <Typography.Title level={5} className="!text-dark-tosca">
          Edit Data Sales
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Perbarui"
      classNames={{ body: "!pt-2" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Nama"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan nama!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          className="!mb-2"
          rules={[
            {
              required: true,
              type: "email",
              message: "Mohon masukkan email yang valid!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Nomor Telepon"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan nomor telepon!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Jenis Kelamin"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon pilih jenis kelamin!" }]}
        >
          <Select>
            <Select.Option value="Male">Laki-laki</Select.Option>
            <Select.Option value="Female">Perempuan</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Alamat"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan alamat!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="target_score"
          label="Target Skor"
          className="!mb-2"
          rules={[{ required: true, message: "Mohon masukkan target skor!" }]}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
