

export function isPriceOnRequest(pkg) {
  return pkg?.price_on_request || false;
}

export function formatPrice(price, pkg = null) {
  if (isPriceOnRequest(pkg) || price === null || price === undefined) {
    return 'Price on Request';
  }
  return `₹${Number(price).toLocaleString()}`;
}

export function getEffectivePrice(pkg) {
  if (!pkg) return null;
  if (isPriceOnRequest(pkg)) return null;
  return pkg.discount_price || pkg.price || null;
}

export const getSavings = (pkg) => {
  const price = Number(pkg.price);
  const discount = Number(pkg.discount_price);

  return discount && price > discount ? formatPrice(price - discount) : null;
};
