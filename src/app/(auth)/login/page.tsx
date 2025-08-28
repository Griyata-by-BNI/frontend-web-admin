"use client";
import { useAuth } from "@/contexts/authContext";
import { useLogin } from "@/services/authServices";
import "@ant-design/v5-patch-for-react-19";
import type { AlertProps } from "antd";
import { Alert, App, Button, Form, Input } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

type ReasonKey =
  | "manual"
  | "expired"
  | "idle"
  | "unauthenticated"
  | "invalid-token"
  | "forbidden"
  | "revoked"
  | "network";

const REASON_MAP: Record<
  ReasonKey,
  { type: AlertProps["type"]; title: string; desc?: string }
> = {
  manual: {
    type: "info",
    title: "Anda telah keluar.",
    desc: "Silakan masuk kembali untuk melanjutkan.",
  },
  expired: {
    type: "warning",
    title: "Sesi berakhir.",
    desc: "Demi keamanan, Anda perlu login kembali.",
  },
  idle: {
    type: "warning",
    title: "Anda otomatis keluar karena tidak aktif.",
    desc: "Silakan login lagi untuk melanjutkan.",
  },
  unauthenticated: {
    type: "info",
    title: "Silakan login untuk mengakses dashboard.",
  },
  "invalid-token": {
    type: "error",
    title: "Token tidak valid.",
    desc: "Silakan login ulang.",
  },
  forbidden: {
    type: "error",
    title: "Akses ditolak.",
    desc: "Akun Anda tidak memiliki izin untuk halaman tersebut.",
  },
  revoked: {
    type: "error",
    title: "Sesi dicabut.",
    desc: "Silakan login kembali.",
  },
  network: {
    type: "error",
    title: "Gangguan jaringan.",
    desc: "Coba login kembali setelah koneksi stabil.",
  },
};

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const { mutateAsync: loginApi, status } = useLogin();
  const searchParams = useSearchParams();

  const reasonParam = searchParams.get("reason") as ReasonKey | null;
  const from = searchParams.get("from") || "";

  const reasonAlert = useMemo(() => {
    if (!reasonParam) return undefined;
    return REASON_MAP[reasonParam];
  }, [reasonParam]);

  const [showReason, setShowReason] = useState(Boolean(reasonAlert));

  const loading = status === "pending";

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const { email, password } = values;
      const response = await loginApi({ email, password });
      login(response.data.token);
    } catch {
      messageApi.error("Login gagal. Mohon periksa email dan password anda!");
    }
  };

  // Styling map untuk dekorasi
  const alertDecorMap: Record<
    NonNullable<AlertProps["type"]>,
    { ring: string; grad: string; bg: string }
  > = {
    info: {
      ring: "ring-blue-200",
      grad: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
    },
    warning: {
      ring: "ring-amber-200",
      grad: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
    },
    error: {
      ring: "ring-rose-200",
      grad: "from-rose-500 to-red-500",
      bg: "bg-rose-50",
    },
    success: {
      ring: "ring-emerald-200",
      grad: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
  };

  const deco = alertDecorMap[reasonAlert?.type || "info"] ?? alertDecorMap.info;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center !bg-light-tosca">
      <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg shadow-gray-500/20 border border-gray-200 relative overflow-hidden">
        {/* Reason alert (manual close, tidak auto-dismiss) */}
        {reasonAlert && showReason && (
          <div
            className={`
              relative mb-6 rounded-xl ${deco.bg}
              ring-1 ${deco.ring} shadow-sm transition-all duration-300
            `}
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${deco.grad}`}
            />
            <Alert
              showIcon
              type={reasonAlert.type}
              message={<div className="font-semibold">{reasonAlert.title}</div>}
              description={
                reasonAlert.desc ||
                (from ? `Halaman sebelumnya: ${from}` : undefined)
              }
              banner
              closable
              onClose={() => setShowReason(false)}
              className="!bg-transparent !border-0 !px-4 !py-3 pl-6"
            />
          </div>
        )}

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
            rules={[{ required: true, message: "Password wajib diisi" }]}
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
