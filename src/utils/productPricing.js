export const getDiscountLabel = product => {
  const price = Number(product?.product_sell_price ?? product?.sell_price ?? product?.price);
  const mrp = Number(product?.product_mrp ?? product?.mrp);

  if (Number.isFinite(mrp) && Number.isFinite(price) && mrp > price && mrp > 0) {
    return `${Math.round(((mrp - price) / mrp) * 100)}%`;
  }

  const rawDiscount = product?.discountPct ?? product?.discount_percentage ?? product?.discount;
  const percent = String(rawDiscount ?? '').match(/[\d.]+/);
  return percent && Number(percent[0]) > 0 ? `${Math.round(Number(percent[0]))}%` : '';
};
