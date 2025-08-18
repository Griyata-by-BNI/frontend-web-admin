import axiosInstance from "@/utils/axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
  VerifyOtpForgotPasswordResponse,
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await axiosInstance.post<RegisterResponse>(
        "/auth/sign-up",
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
        "/auth/sign-in",
        data
      );

      return response.data;
    },
  });
};

export const useVerifyEmailRegister = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: VerifyEmailPayload) => {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/sign-up-verify",
        {
          email: email.trim().toLowerCase(),
          verifyToken: otp,
        }
      );

      return response.data;
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post("/auth/resend-otp", {
        email: email.trim().toLowerCase(),
      });

      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      return response.data;
    },
  });
};

export const useVerifyOtpForgotPassword = () => {
  return useMutation<
    VerifyOtpForgotPasswordResponse,
    Error,
    { email: string; otp: string }
  >({
    mutationFn: async ({ email, otp }) => {
      const response =
        await axiosInstance.post<VerifyOtpForgotPasswordResponse>(
          "/auth/forgot-password-verify-otp",
          {
            email: email.trim().toLowerCase(),
            otp,
          }
        );

      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      email,
      token,
      newPassword,
    }: {
      email: string;
      token: string;
      newPassword: string;
    }) => {
      const response = await axiosInstance.post("/auth/forgot-password-reset", {
        email: email.trim().toLowerCase(),
        tokenReset: token,
        newPassword,
      });

      return response.data;
    },
  });
};

export const useResendOtpRegister = useResendOtp;
export const useResendOtpForgotPassword = useResendOtp;
