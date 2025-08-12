import { useState, useCallback } from "react";
import { InterestRate, ScheduleItem } from "../types";

interface DetailedScheduleParams {
  propertyPrice: number;
  downPayment: number;
  tenor: number;
  selectedRate: InterestRate | null;
  isValidTenor: boolean;
}

export const useDetailedSchedule = () => {
  const [showDetailedSchedule, setShowDetailedSchedule] = useState<boolean>(false);
  const [detailedSchedule, setDetailedSchedule] = useState<ScheduleItem[]>([]);

  const generateDetailedSchedule = useCallback(({ propertyPrice, downPayment, tenor, selectedRate, isValidTenor }: DetailedScheduleParams) => {
    if (!propertyPrice || !downPayment || !selectedRate || !isValidTenor || propertyPrice <= 0 || downPayment <= 0 || tenor <= 0) {
      return;
    }

    const loanAmount = propertyPrice - downPayment;
    if (loanAmount <= 0) return;

    const totalMonths = tenor * 12;
    const fixedMonths = selectedRate.fixed_duration * 12;
    let remainingBalance = loanAmount;
    const schedule: ScheduleItem[] = [];

    if (selectedRate.type === "single-fixed") {
      const monthlyRate = (selectedRate.interest_rate as number) / 100 / 12;
      const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

      for (let month = 1; month <= fixedMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = payment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
          key: month,
          month,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance),
          interestRate: selectedRate.interest_rate as number,
        });
      }
    } else if (selectedRate.type === "tiered-fixed") {
      for (let month = 1; month <= fixedMonths; month++) {
        let currentRate = 0;
        
        for (const rateInfo of selectedRate.interest_rate as Array<{ rate: number; note: string }>) {
          const match = rateInfo.note.match(/tahun ke-(\\d+)(?:\\s+sampai\\s+dengan\\s+(\\d+))?/);
          if (match) {
            const start = parseInt(match[1]);
            const end = match[2] ? parseInt(match[2]) : start;
            const currentYear = Math.ceil(month / 12);
            if (currentYear >= start && currentYear <= end) {
              currentRate = rateInfo.rate;
              break;
            }
          }
        }
        
        const monthlyRate = currentRate / 100 / 12;
        const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = payment - interestPayment;
        remainingBalance -= principalPayment;

        schedule.push({
          key: month,
          month,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance),
          interestRate: currentRate,
        });
      }
    }

    setDetailedSchedule(schedule);
    setShowDetailedSchedule(true);
  }, []);

  return {
    showDetailedSchedule,
    detailedSchedule,
    setShowDetailedSchedule,
    generateDetailedSchedule
  };
};