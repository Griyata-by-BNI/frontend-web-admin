export type ApiStatus =
  | "submitted"
  | "under_review"
  | "verified"
  | "rejected"
  | "completed";

export interface SubmissionDetail {
  submission: {
    id: number;
    status: ApiStatus;
    verified_at: string;
    verified_by: string;
    verification_notes: string;
    createdAt: string;
  };
  debtor_information: {
    full_name: string;
  };
  spouse_information?: {
    full_name: string;
  };
  employee_information: {
    company_name: string;
  };
  loan_information: {
    property_id: number;
  };
}
