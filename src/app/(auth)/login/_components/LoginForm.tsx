import { useLogin } from "@/services/authServices";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input, message } from "antd";
import Link from "next/link";
import React from "react";

const LoginForm: React.FC = () => {
  const { mutateAsync: login, error, status } = useLogin();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    try {
      const { email, password, rememberMe } = values;

      await login({ email, password });

      if (rememberMe) {
        window.localStorage.setItem(
          "credential",
          JSON.stringify({ email, password })
        );
      } else {
        window.localStorage.removeItem("credential");
      }
    } catch (err) {
      message.error("Login gagal. Mohon periksa email dan password anda!");
    }
  };

  const loading = status === "pending";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 text-center">
          Masuk aplikasi
        </h2>
        <h3 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-4 text-center">
          dengan akun anda
        </h3>

        <p className="text-gray-600 text-sm sm:text-base text-center">
          Masukkan email dan password untuk login
        </p>
      </div>

      {error && <Alert message={error.message} type="error" className="mb-4" />}

      <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
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
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            disabled={loading}
          />
        </Form.Item>

        <div className="flex items-center justify-between mb-4">
          <Form.Item noStyle name="rememberMe" valuePropName="checked">
            <Checkbox disabled={loading}>Ingat Saya</Checkbox>
          </Form.Item>

          <Link
            href="/forgot-password"
            className={`!text-teal-600 hover:!text-teal-700 font-medium ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Lupa password?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full "
            size="large"
          >
            Masuk
          </Button>
        </Form.Item>

        <p className="text-center text-gray-600 text-sm sm:text-base">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className={`!text-teal-600 hover:!text-teal-800 font-semibold ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Daftar
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default LoginForm;
