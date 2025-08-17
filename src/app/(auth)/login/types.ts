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
