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
          Create Sales Data
        </Typography.Title>
      }
      maskClosable={false}
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Create"
      classNames={{ body: "!pt-2" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          className="!mb-2"
          rules={[{ required: true, message: "Please input name!" }]}
        >
          <Input placeholder="Enter full name" />
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
          <Input placeholder="example@company.com" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          className="!mb-2"
          rules={[
            { required: true, message: "Please input phone number!" },
            {
              pattern: /^[0-9+\-\s()]+$/,
              message: "Please input valid phone number!",
            },
            { min: 10, message: "Phone number must be at least 10 digits!" },
          ]}
        >
          <Input placeholder="081234567890" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          className="!mb-2"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="Select gender">
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          className="!mb-2"
          rules={[
            { required: true, message: "Please input address!" },
            { min: 5, message: "Address must be at least 5 characters!" },
          ]}
        >
          <Input placeholder="Enter city or region" />
        </Form.Item>

        <Form.Item
          name="target_score"
          label="Target Score"
          className="!mb-2"
          rules={[{ required: true, message: "Please input target score!" }]}
        >
          <InputNumber
            min={0}
            max={100}
            placeholder="Enter score (0-100)"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
