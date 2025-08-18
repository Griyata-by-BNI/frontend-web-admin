export type ApprovalItem = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_nik: string;
  property_name: string;
  property_address: string;
  credit_amount: number;
  tenor_months: number;
  interest_rate: number;
  status: "need_approve" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};