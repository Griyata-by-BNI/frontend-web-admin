import axiosInstance from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await axiosInstance.post<RegisterResponse>(
        "/api/v1/auth/sign-up",
        data
      );

      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await axiosInstance.post<LoginResponse>(
        "/api/v1/auth/sign-in",
        data
      );

      return response.data;
    },
  });
};

export const useVerifyEmailRegister = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: VerifyEmailPayload) => {
      const response = await axiosInstance.post("/api/v1/auth/sign-up-verify", {
        email: email.trim().toLowerCase(),
        verifyToken: otp,
      });

      return response.data;
    },
  });
};

export const useResendOtpRegister = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post("/api/v1/auth/resend-otp", {
        email: email.trim().toLowerCase(),
      });

      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post("/api/v1/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      return response.data;
    },
  });
};
