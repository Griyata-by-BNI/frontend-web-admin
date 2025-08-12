import { useState, useEffect } from "react";
import interestRateData from "@/data/interest-rate.json";
import { AffordabilityParams } from "../types";

export const useAffordabilityCalculation = (params: AffordabilityParams) => {
  const [affordablePrice, setAffordablePrice] = useState<number>(0);
  const [isAffordable, setIsAffordable] = useState<boolean>(false);

  const calculateAffordability = () => {
    const { monthlyIncome, monthlyExpenses, monthlyInstallment, downPayment, tenor, selectedRateId } = params;
    
    if (!monthlyIncome || !monthlyInstallment || !selectedRateId) {
      setAffordablePrice(0);
      setIsAffordable(false);
      return;
    }

    const netIncome = monthlyIncome - monthlyExpenses;
    const maxAffordableInstallment = netIncome * 0.3; // 30% rule
    
    if (monthlyInstallment > maxAffordableInstallment) {
      setIsAffordable(false);
      setAffordablePrice(0);
      return;
    }

    const selectedRate = interestRateData.find(rate => rate.id === selectedRateId);
    if (!selectedRate) {
      setAffordablePrice(0);
      setIsAffordable(false);
      return;
    }

    let interestRate = 0;
    if (selectedRate.type === "single-fixed") {
      interestRate = selectedRate.interest_rate as number;
    } else if (selectedRate.type === "tiered-fixed") {
      // Use first rate for calculation
      const rates = selectedRate.interest_rate as Array<{ rate: number; note: string }>;
      interestRate = rates[0]?.rate || 0;
    }

    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = tenor * 12;
    
    // Calculate loan amount from monthly installment
    const loanAmount = monthlyInstallment * (Math.pow(1 + monthlyRate, totalMonths) - 1) / 
                     (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
    
    const totalPrice = loanAmount + downPayment;
    
    setAffordablePrice(totalPrice);
    setIsAffordable(true);
  };

  useEffect(() => {
    calculateAffordability();
  }, [params]);

  return { affordablePrice, isAffordable };
};