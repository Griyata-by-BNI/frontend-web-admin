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
          Edit Sales Data
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Update"
      classNames={{ body: "!pt-2" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          className="!mb-2"
          rules={[{ required: true, message: "Please input name!" }]}
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
              message: "Please input valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          className="!mb-2"
          rules={[{ required: true, message: "Please input phone number!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          className="!mb-2"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          className="!mb-2"
          rules={[{ required: true, message: "Please input address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="target_score"
          label="Target Score"
          className="!mb-2"
          rules={[{ required: true, message: "Please input target score!" }]}
        >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
