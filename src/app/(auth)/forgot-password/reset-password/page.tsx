"use client";

import { useResetPassword } from "@/services/authServices";
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Typography, message } from "antd";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";

const { Title, Text } = Typography;

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [form] = Form.useForm();
  const [isSuccess, setIsSuccess] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const handleResetPassword = useCallback(
    async (values: { password: string; confirmPassword: string }) => {
      if (!email || !token) {
        message.error(
          "Parameter tidak valid. Silakan ulangi proses reset password."
        );
        return;
      }

      resetPasswordMutation.mutate(
        {
          email,
          token,
          newPassword: values.password,
        },
        {
          onSuccess: (data) => {
            message.success(data.message || "Password berhasil direset!");
            setIsSuccess(true);

            setTimeout(() => {
              router.push("/login");
            }, 1500);
          },
          onError: (error: any) => {
            const errorMessage =
              error.response?.data?.message ||
              "Terjadi kesalahan. Silakan coba lagi.";

            message.error(errorMessage);
          },
        }
      );
    },
    [email, token, router, resetPasswordMutation]
  );

  if (!email || !token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }}
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            {isSuccess ? (
              <CheckCircleOutlined className="text-2xl !text-white" />
            ) : (
              <LockOutlined className="text-2xl !text-white" />
            )}
          </div>

          <Title level={3} className="!text-primary-tosca !mb-2">
            {isSuccess ? "Password Berhasil Direset!" : "Reset Password"}
          </Title>

          <Text type="secondary" className="block mb-4">
            {isSuccess
              ? "Password Anda berhasil direset. Anda akan dialihkan ke halaman login."
              : `Masukkan password baru untuk akun: ${email}`}
          </Text>
        </div>

        {!isSuccess ? (
          <Form form={form} onFinish={handleResetPassword} layout="vertical">
            <Form.Item
              name="password"
              label="Password Baru"
              rules={[
                { required: true, message: "Password wajib diisi" },
                { min: 8, message: "Password minimal 8 karakter" },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Password harus mengandung huruf besar, kecil, angka, dan karakter khusus",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Masukkan password baru"
                disabled={resetPasswordMutation.isPending}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Konfirmasi Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Konfirmasi password wajib diisi",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Password tidak cocok"));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Konfirmasi password baru"
                disabled={resetPasswordMutation.isPending}
              />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={resetPasswordMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-12"
            >
              {resetPasswordMutation.isPending
                ? "Mereset Password..."
                : "Reset Password"}
            </Button>
          </Form>
        ) : (
          <Alert
            message="Reset Password Berhasil!"
            description="Password Anda telah berhasil direset. Anda akan dialihkan ke halaman login dalam beberapa saat."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            className="text-center"
          />
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
