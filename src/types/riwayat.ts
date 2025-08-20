export type ApiStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "completed";

export interface DebtorInformation {
  full_name: string;
  mother_maiden_name: string;
  gender: string;
  birth_date: string;
  place_of_birth: string;
  marital_status: string;
  residence_status: string;
  nik: string;
  tax_id_number: string;
  email: string;
  phone_number: string;
  id_card_address: string;
  domicile_address: string;
}

export interface SpouseInformation {
  full_name: string;
  gender: string;
  birth_date: string;
  nationality: string;
  education: string;
  nik: string;
  tax_id_number: string;
  phone_number: string;
  email: string;
  id_card_address: string;
}

export interface EmergencyContact {
  fullName: string;
  address: string;
  rt: number;
  rw: number;
  city: string;
  postalCode: number;
  homePhoneNumber: number;
  mobilePhoneNumber: number;
  relationship: string;
}

export interface EmploymentHistory {
  employment_type: string;
  company_name: string;
  address: string;
  postal_code: string;
  city: string;
  phone_number: string;
  job_title: string;
  position: string;
  industry_type: string;
  length_of_work_years: number;
  length_of_work_months: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  basic_salary: number;
}

export interface EmployeeInformation {
  employment_type: string;
  company_name: string;
  address: string;
  postal_code: string;
  city: string;
  phone_number: string;
  job_title: string;
  position: string;
  industry_type: string;
  length_of_work_years: number;
  length_of_work_months: number;
  other_income: number;
  total_income: number;
  total_expenses: number;
  basic_salary: number;
  employmentHistory: EmploymentHistory;
}

export interface PropertyInformation {
  property_name: string;
  developer_group: string;
  image_url: string;
}

export interface SubmissionSummary {
  id: number;
  property_name: string;
  developer_group: string;
  submitted_at: string;
  status: ApiStatus;
  image_url: string;
}

export interface SubmissionDetail {
  submission: {
    id: number;
    status: ApiStatus;
    submitted_at: string;
    verified_at: string;
    verified_by?: number;
    verification_notes?: string;
  };
  property_information: PropertyInformation;
  debtor_information: DebtorInformation;
  spouse_information: SpouseInformation | null;
  emergency_contact: EmergencyContact;
  employee_information: EmployeeInformation;
}

export interface TrackingData {
  debtor_information: DebtorInformation;
  spouse_information: SpouseInformation | null;
  emergency_contact: EmergencyContact;
  employee_information: EmployeeInformation;
}

export interface UpdateStatusRequest {
  status: ApiStatus;
  verification_notes?: string;
}
