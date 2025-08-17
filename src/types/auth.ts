export interface RegisterPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};
