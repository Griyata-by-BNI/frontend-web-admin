export interface InterestRate {
  id: number;
  title: string;
  minimum_tenor: number;
  type: "single-fixed" | "tiered-fixed";
  fixed_duration: number;
  interest_rate: number | Array<{ rate: number; note: string }>;
  floating_note: string;
}

export interface KPRSimulatorProps {
  className?: string;
  initialPropertyPrice?: number;
  additionalButton?: React.ReactNode;
  size?: "small" | "default";
}

export interface ScheduleItem {
  key: number;
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  interestRate: number;
}
