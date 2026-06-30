import { DiscountPublic } from '../types';

export const DESIGN_FEE_RATE = 0.10;

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
