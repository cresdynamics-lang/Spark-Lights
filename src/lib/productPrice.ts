export function isValidDisplayPrice(price: string | undefined): boolean {
  if (!price) return false;
  const value = parseInt(price.replace(/,/g, ''), 10);
  return Number.isFinite(value) && value > 0;
}

export function resolveProductPrice(apiPrice: string, fallbackPrice: string): string {
  return isValidDisplayPrice(apiPrice) ? apiPrice : fallbackPrice;
}
