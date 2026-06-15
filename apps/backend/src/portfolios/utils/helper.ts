import type { CurrencyType } from '@atlas/types';

const USD_TO_RUB = 90; // Нужно заменить на реальный курс.

export function amountToRub(amount: number, currency: CurrencyType): number {
	if (currency === 'USD') {
		return amount * USD_TO_RUB;
	}
	return amount;
}

export function rubToUsd(rub: number): number {
	return rub / USD_TO_RUB;
}

export function roundMoney(n: number): number {
	return Math.round(n * 100) / 100;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function yearsBetween(startDate: Date, endDate: Date): number {
	return (endDate.getTime() - startDate.getTime()) / MS_PER_YEAR;
}
