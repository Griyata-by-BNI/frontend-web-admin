export interface JobType {
  value: string;
  label: string;
  maxAge: number;
}

export interface KPRAffordabilityProps {
  className?: string;
}

export interface AffordabilityParams {
  jobType: string;
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  tenor: number;
  downPayment: number;
  monthlyInstallment: number;
  selectedRateId: number | null;
}