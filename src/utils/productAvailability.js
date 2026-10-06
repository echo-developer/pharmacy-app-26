const truthyStockFlag = value =>
  value === true || value === 1 || ['1', 'true', 'yes', 'out_of_stock', 'out of stock'].includes(
    String(value).trim().toLowerCase(),
  );

const isZeroStock = value => {
  if (value === false) return true;
  if (value == null || value === '') return false;
  if (['false', 'no', 'unavailable', 'out_of_stock', 'out of stock'].includes(
    String(value).trim().toLowerCase(),
  )) return true;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue <= 0;
};

export const isProductOutOfStock = product => {
  if (!product) return false;

  if (['is_out_of_stock', 'out_of_stock', 'isOutOfStock'].some(
    field => truthyStockFlag(product[field]),
  )) return true;

  if (['in_stock', 'is_in_stock', 'is_available', 'is_stock_available'].some(
    field => product[field] != null && isZeroStock(product[field]),
  )) return true;

  if (['qty', 'stock', 'stock_quantity', 'available_quantity'].some(
    field => product[field] != null && isZeroStock(product[field]),
  )) return true;

  return ['stock', 'stock_status', 'availability', 'availability_status', 'in_stock', 'is_available'].some(field =>
    /out[\s_-]*of[\s_-]*stock|unavailable/i.test(String(product[field] || '')),
  );
};
