"use client";
import { useForgotPassword } from "@/services/authServices";
import { KeyOutlined, MailOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = useCallback(
    async (values: { email: string }) => {
      const emailValue = values.email.trim();
      setEmail(emailValue);

      forgotPasswordMutation.mutate(emailValue, {
        onSuccess: (data) => {
          message.success(data.message || "Kode verifikasi berhasil dikirim!");
          setIsSuccess(true);

          setTimeout(() => {
            router.push(
              `/forgot-password/otp?email=${encodeURIComponent(emailValue)}`
            );
          }, 1500);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan. Silakan coba lagi.";
          message.error(errorMessage);
        },
      });
    },
    [router, forgotPasswordMutation]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <KeyOutlined className="text-2xl !text-white" />
          </div>

          <Title level={3} className="!text-primary-black !mb-2">
            Lupa Password?
          </Title>

          <Text type="secondary" className="block mb-4">
            Masukkan alamat email Anda dan kami akan mengirimkan kode verifikasi
            untuk mereset password
          </Text>
        </div>

        {isSuccess ? (
          <Alert
            message="Kode Berhasil Dikirim!"
            description={`Kode verifikasi telah dikirim ke ${email}. Anda akan dialihkan ke halaman verifikasi dalam beberapa saat.`}
            type="success"
            showIcon
            className="text-center"
          />
        ) : (
          <Space direction="vertical" className="w-full">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={forgotPasswordMutation.isPending}
            >
              <Form.Item
                name="email"
                className="!mb-8"
                label="Alamat Email"
                rules={[
                  { required: true, message: "Email harus diisi" },
                  { type: "email", message: "Format email tidak valid" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="contoh@email.com"
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item noStyle>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending
                    ? "Mengirim Kode..."
                    : "Kirim Kode Verifikasi"}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
