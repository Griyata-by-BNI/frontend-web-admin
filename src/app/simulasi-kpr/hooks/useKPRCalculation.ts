import { useState, useEffect } from "react";

interface KPRParams {
  propertyPrice: number;
  downPayment: number;
  tenor: number;
  selectedRate: any;
}

export const useKPRCalculation = ({ propertyPrice, downPayment, tenor, selectedRate }: KPRParams) => {
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);

  const isValidTenor = !selectedRate || tenor >= selectedRate.minimum_tenor;

  const calculateKPR = () => {
    if (!propertyPrice || !downPayment || !selectedRate || !isValidTenor) return;

    const loanAmount = propertyPrice - downPayment;

    if (selectedRate.type === "single-fixed") {
      const monthlyRate = selectedRate.interest_rate / 100 / 12;
      const totalMonths = tenor * 12;
      const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      setMonthlyPayment(payment);
      setPaymentSchedule([]);
    } else if (selectedRate.type === "tiered-fixed") {
      const schedule = selectedRate.interest_rate.map((rateInfo: any, index: number) => {
        const monthlyRate = rateInfo.rate / 100 / 12;
        const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenor * 12));
        return {
          key: index,
          period: rateInfo.note,
          rate: `${rateInfo.rate}%`,
          monthlyPayment: payment,
        };
      });
      setPaymentSchedule(schedule);
      setMonthlyPayment(0);
    }
  };

  useEffect(() => {
    calculateKPR();
  }, [propertyPrice, downPayment, tenor, selectedRate, isValidTenor]);

  return { monthlyPayment, paymentSchedule, isValidTenor };
};