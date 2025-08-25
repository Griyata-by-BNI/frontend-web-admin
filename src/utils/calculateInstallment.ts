const calculateInstallment = (
  price?: string | null,
  tenor = 180, // 15 tahun
  dpPercent = 10, // 10%
  annualInterest = 3.25 // %
): string => {
  if (!price) return "N/A";
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) return "-";

  const dp = priceNum * (dpPercent / 100);
  const principal = priceNum - dp;
  const r = annualInterest / 100 / 12;
  const n = tenor;

  const installment = (principal * r) / (1 - Math.pow(1 + r, -n));

  if (installment >= 1_000_000) {
    const juta = installment / 1_000_000;
    return `Rp ${
      Number.isInteger(juta) ? juta.toFixed(0) : juta.toFixed(1)
    } JT`;
  }
  if (installment >= 1_000) {
    return `Rp ${Math.round(installment / 1_000)} RB`;
  }
  return `Rp ${Math.round(installment).toLocaleString("id-ID")}`;
};

export default calculateInstallment;
