const formatPrice = (priceString: string | null): string => {
  if (!priceString) return "N/A";
  const price = Number(priceString);
  if (!Number.isFinite(price) || price <= 0) return "0";
  if (price >= 1_000_000_000)
    return `${(price / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
  if (price >= 1_000_000)
    return `${(price / 1_000_000).toFixed(1).replace(".0", "")} JT`;
  return new Intl.NumberFormat("id-ID").format(price);
};

export default formatPrice;
