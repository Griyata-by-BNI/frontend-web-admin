import { useState, useEffect } from "react";
import { InterestRate } from "../types";

interface KPRParams {
  propertyPrice: number;
  downPayment: number;
  tenor: number;
  selectedRate: InterestRate | null;
}

export const useKPRCalculation = ({ propertyPrice, downPayment, tenor, selectedRate }: KPRParams) => {
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);

  const isValidTenor = !selectedRate || tenor >= selectedRate.minimum_tenor;

  const calculateKPR = () => {
    if (!propertyPrice || !downPayment || !selectedRate || !isValidTenor) {
      setMonthlyPayment(0);
      setPaymentSchedule([]);
      return;
    }

    const loanAmount = propertyPrice - downPayment;
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      setPaymentSchedule([]);
      return;
    }

    if (selectedRate.type === "single-fixed") {
      const monthlyRate = (selectedRate.interest_rate as number) / 100 / 12;
      const totalMonths = tenor * 12;
      const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      setMonthlyPayment(payment);
      setPaymentSchedule([]);
    } else if (selectedRate.type === "tiered-fixed") {
      try {
        const schedule = (selectedRate.interest_rate as Array<{ rate: number; note: string }>).map((rateInfo, index) => {
          const monthlyRate = rateInfo.rate / 100 / 12;
          const totalMonths = tenor * 12;
          const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1);
          return {
            key: index,
            period: rateInfo.note,
            rate: `${rateInfo.rate}%`,
            monthlyPayment: payment,
          };
        });
        setPaymentSchedule(schedule);
        setMonthlyPayment(0);
      } catch (error) {
        setPaymentSchedule([]);
        setMonthlyPayment(0);
      }
    }
  };

  useEffect(() => {
    calculateKPR();
  }, [propertyPrice, downPayment, tenor, selectedRate, isValidTenor]);

  return { monthlyPayment, paymentSchedule, isValidTenor };
};