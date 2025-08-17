"use client";

import {
  useResendOtpForgotPassword,
  useVerifyOtpForgotPassword,
} from "@/services/authServices";
import { CheckCircleOutlined, MailOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Input,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;

const OTPForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const verifyOtpMutation = useVerifyOtpForgotPassword();
  const resendOtpMutation = useResendOtpForgotPassword();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 4);
    setOtp(sanitizedValue);
  };

  const handleVerify = useCallback(async () => {
    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          const token = data.tokenReset || data.token || data.resetToken || "";

          message.success(data.message || "OTP berhasil diverifikasi!");
          setResetToken(token);
          setIsVerified(true);

          setTimeout(() => {
            router.push(
              `/forgot-password/reset-password?email=${encodeURIComponent(
                email
              )}&token=${encodeURIComponent(token)}`
            );
          }, 1500);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Terjadi kesalahan. Silakan coba lagi.";

          message.error(errorMessage);
          setOtp("");
        },
      }
    );
  }, [email, otp, router, verifyOtpMutation]);

  const handleResendOtp = useCallback(async () => {
    resendOtpMutation.mutate(email, {
      onSuccess: (data) => {
        setOtp("");
        setResendCooldown(60);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Gagal mengirim kode verifikasi.";
        message.error(errorMessage);
      },
    });
  }, [email, resendOtpMutation]);

  const canVerify = otp.length === 4 && !verifyOtpMutation.isPending;
  const canResend = resendCooldown === 0 && !resendOtpMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md shadow-2xl shadow-gray-500/20 !border-gray-200"
        style={{ borderRadius: 16 }}
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            {isVerified ? (
              <CheckCircleOutlined className="text-2xl !text-white" />
            ) : (
              <MailOutlined className="text-2xl !text-white" />
            )}
          </div>

          <Title level={3} className="!text-primary-tosca !mb-2">
            {isVerified ? "OTP Terverifikasi!" : "Verifikasi Kode OTP"}
          </Title>

          <Text type="secondary" className="block mb-4">
            {isVerified
              ? "Kode OTP berhasil diverifikasi. Anda akan dialihkan ke halaman reset password."
              : `Masukkan kode verifikasi 4 digit yang telah dikirim ke: ${email}`}
          </Text>
        </div>

        {!isVerified ? (
          <Space direction="vertical" size="large" className="w-full">
            <div className="flex flex-col items-center">
              <Input.OTP
                length={4}
                value={otp}
                onChange={handleOtpChange}
                size="large"
                disabled={verifyOtpMutation.isPending}
                separator={<span>-</span>}
              />
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={verifyOtpMutation.isPending}
              disabled={!canVerify}
              onClick={handleVerify}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 h-12"
            >
              {verifyOtpMutation.isPending
                ? "Memverifikasi..."
                : "Verifikasi Kode"}
            </Button>

            <div className="text-center flex gap-2 items-center justify-center">
              <Text type="secondary">Tidak menerima kode?</Text>

              <Button
                type="link"
                loading={resendOtpMutation.isPending}
                disabled={!canResend}
                onClick={handleResendOtp}
                className={clsx("!p-0 h-max", {
                  "!text-primary-tosca hover:!text-dark-tosca":
                    !resendOtpMutation.isPending || resendCooldown < 1,
                  "!text-gray-400":
                    resendOtpMutation.isPending || resendCooldown > 0,
                })}
              >
                {resendOtpMutation.isPending ? (
                  <Spin size="small" className="mr-1" />
                ) : null}

                {resendCooldown > 0
                  ? `Kirim ulang dalam ${resendCooldown}s`
                  : "Kirim ulang kode"}
              </Button>
            </div>
          </Space>
        ) : (
          <Alert
            message="Verifikasi Berhasil!"
            description="Kode OTP telah berhasil diverifikasi. Anda akan dialihkan ke halaman reset password dalam beberapa saat."
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

export default OTPForgotPasswordPage;
