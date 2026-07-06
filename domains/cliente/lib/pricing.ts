import { DiscountPublic, Store } from '../types';

export function designFeeRate(store: Pick<Store, 'designFeePercentage'>): number {
  const percentage = Number(store.designFeePercentage);
  return Number.isFinite(percentage) && percentage > 0 ? percentage / 100 : 0;
}

export function designFeePercentageLabel(store: Pick<Store, 'designFeePercentage'>): number {
  const percentage = Number(store.designFeePercentage);
  return Number.isFinite(percentage) && percentage > 0 ? percentage : 0;
}

export function discountAppliesToQuantity(discount: DiscountPublic, quantity: number): boolean {
  const min = Number(discount.minQuantity || 0);
  const max = Number(discount.maxQuantity || 0);
  return quantity >= min && (max <= min || quantity <= max);
}

export function discountRuleLabel(discount: DiscountPublic): string {
  const min = Number(discount.minQuantity || 0);
  const max = Number(discount.maxQuantity || 0);
  const range = max <= min ? `${min} a mas unidades` : `${min}-${max} unidades`;
  return `${range}: -${Number(discount.discountPercentage || 0)}%`;
}

export function bestDiscount(discounts: DiscountPublic[] = [], quantity: number): DiscountPublic | null {
  return discounts
    .filter((discount) => discountAppliesToQuantity(discount, quantity))
    .sort((left, right) => Number(right.discountPercentage || 0) - Number(left.discountPercentage || 0))[0] || null;
}

export function money(value: number): string {
  return value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
