// src/lib/commission.ts
export type CommissionTier = {
  min: number;
  max: number; // Infinity for open-ended
  rate: number; // if isPercentage true => 0.18 means 18%
  isPercentage?: boolean;
  label?: string;
};

export const COMMISSION_TIERS: CommissionTier[] = [
  { min: 0,     max: 499.99,  rate: 100,  isPercentage: false, label: "Flat NPR 100 (< 500)" },
  { min: 500,   max: 1999.99,    rate: 0.18, isPercentage: true,  label: "18% (500–1999.99)" },
  { min: 2000,  max: 4999.99,    rate: 0.16, isPercentage: true,  label: "16% (2000–4999.99)" },
  { min: 5000,  max: 7999.99,    rate: 0.14, isPercentage: true,  label: "14% (5000–7999.99)" },
  { min: 8000,  max: 9999.99,   rate: 0.12, isPercentage: true,  label: "12% (8000–9999.99)" },
  { min: 10000, max: Infinity,rate: 0.10, isPercentage: true,  label: "10% (> 10000)" },
];

export function findCommissionTier(amountInr: number): CommissionTier {
  return (
    COMMISSION_TIERS.find(t => amountInr >= t.min && amountInr <= t.max)
    ?? COMMISSION_TIERS[COMMISSION_TIERS.length - 1]
  );
}

// convenience if you just need a percentage for the slider
export function getTierRatePct(amountInr: number): number | null {
  const tier = findCommissionTier(amountInr);
  return tier.isPercentage ? tier.rate * 100 : null; // 0.18 -> 18
}
