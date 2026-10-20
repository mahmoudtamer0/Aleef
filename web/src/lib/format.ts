// 1250 -> "EGP 1,250"
export const formatMoney = (amount: number, currency = "EGP") =>
  `${currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

// price 80, was 100 -> 20 (percent). 0 when it is not on sale.
export const discountPercent = (price: number, originalPrice?: number) =>
  originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

// "26b879d4-0000-..." -> "#26B879" (same style as the dashboard)
export const orderNumber = (id: string) => `#${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
