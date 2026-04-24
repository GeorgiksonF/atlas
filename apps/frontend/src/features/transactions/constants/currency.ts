import type { CurrencyType } from '@atlas/types';

export const CURRENCY_LABELS: Record<CurrencyType, string> = {
	RUB: '₽ RUB',
	USD: '$ USD',
};

export const CURRENCY_TYPES = Object.keys(CURRENCY_LABELS) as CurrencyType[];
