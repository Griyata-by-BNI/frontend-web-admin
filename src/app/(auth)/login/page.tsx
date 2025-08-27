"use client";
import { useAuth } from "@/contexts/authContext";
import { useLogin } from "@/services/authServices";
import "@ant-design/v5-patch-for-react-19";
import { App, Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import React, { useEffect } from "react";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { mutateAsync: loginApi, status } = useLogin();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const { email, password } = values;
      const response = await loginApi({ email, password });
      login(response.data.token);
    } catch (err: any) {
      messageApi.error("Login gagal. Mohon periksa email dan password anda!");
    }
  };

  const loading = status === "pending";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center !bg-light-tosca">
      <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg shadow-gray-500/20 border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 text-center">
            Griyata Dashboard
          </h2>

          <p className="text-gray-600 text-sm sm:text-base text-center">
            Masukkan email dan password untuk login
          </p>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email wajib diisi" },
              { type: "email", message: "Email tidak valid" },
            ]}
          >
            <Input
              placeholder="Alamat email"
              autoComplete="email"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Password wajib diisi" },
              { min: 8, message: "Password harus minimal 8 karakter" },
            ]}
          >
            <Input.Password
              placeholder="Kata sandi"
              autoComplete="current-password"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full mt-4"
              size="large"
            >
              Masuk
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
