export type Sales = {
  id: number;
  npp: string;
  performance: number | null;
  monthly_target: number;
  region_id: number;
  user_id: number;
  user?: {
    id: number;
    full_name: string;
    email: string;
    role: string;
    is_verified: boolean;
  };
};
