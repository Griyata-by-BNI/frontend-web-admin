export interface Submission {
  id: number;
  customer_name: string;
  email: string;
  status: string;
  created_at: string;
  sales_id: number;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Sorting {
  sortBy: string;
  sortOrder: string;
}

export interface KprDashboardResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    submissions: Submission[];
    timing: string;
    count: number;
    filtered_by_sales: boolean;
    pagination: {
      currentPage: number;
      pageSize: number;
      total_items: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface KprDashboardParams {
  status?: string;
  page: number;
  limit: number;
  search?: string;
}

export interface SubmissionDetail {
  submission: {
    status: string;
    verified_at: string;
    verified_by: string;
    verification_notes: string;
    interest_id: number;
    created_at: string;
  };
  debtor_information: {
    full_name: string;
    mother_maiden_name: string;
    gender: string;
    birth_date: string;
    place_of_birth: string;
    marital_status: string;
    residence_status: string;
    nik: string;
    education: string;
    tax_id_number: string;
    email: string;
    phone_number: string;
    id_card_address: string;
    domicile_address: string;
  };
  spouse_information: {
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
  };
  emergency_contact: {
    fullName: string;
    address: string;
    homePhoneNumber: number;
    mobilePhoneNumber: number;
    relationship: string;
  };
  employee_information: {
    employment_type: string;
    company_name: string;
    address: string;
    phone_number: string;
    job_title: string;
    position: string;
    industry_type: string;
    length_of_work_years: number;
    other_income: number;
    total_income: number;
    total_expenses: number;
    basic_salary: number;
    employmentHistory: {
      employment_type: string;
      company_name: string;
      address: string;
      phone_number: string;
      job_title: string;
      position: string;
      industry_type: string;
      length_of_work_years: number;
      other_income: number;
      total_income: number;
      total_expenses: number;
      basic_salary: number;
    };
  };
  loan_information: {
    property_id: number;
    loan_value: string;
    monthly_period: number;
  };
  documents: { type: string; url: string }[];
}

export interface SubmissionDetailResponse {
  status: {
    code: number;
    message: string;
  };
  data: SubmissionDetail;
}

export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "completed";

export interface UpdateSubmissionStatusPayload {
  status: SubmissionStatus;
  verification_notes?: string;
}

export interface UpdateSubmissionStatusResponse {
  status: { code: number; message: string };
  data?: unknown;
}
