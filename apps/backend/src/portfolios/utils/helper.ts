import type { CurrencyType } from '@atlas/types';

import { toMoscowCalendarDate } from './moscow-date.utils';

export type FxConversionContext = {
	currentUsdToRub: number;
	usdToRubAt: (date: Date) => number;
};

export const createFxConversionContext = (
	currentUsdToRub: number,
	historicalRatesByDate: ReadonlyMap<string, number> = new Map(),
): FxConversionContext => ({
	currentUsdToRub,
	usdToRubAt: (date: Date) => {
		const calendarDate = toMoscowCalendarDate(date);
		return historicalRatesByDate.get(calendarDate) ?? currentUsdToRub;
	},
});

export function amountToRub(
	amount: number,
	currency: CurrencyType,
	fx: FxConversionContext,
	at?: Date,
): number {
	if (currency === 'USD') {
		const rate = at ? fx.usdToRubAt(at) : fx.currentUsdToRub;
		return amount * rate;
	}
	return amount;
}

export function rubToUsd(rub: number, fx: FxConversionContext): number {
	return rub / fx.currentUsdToRub;
}

export function roundMoney(n: number): number {
	return Math.round(n * 100) / 100;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function yearsBetween(startDate: Date, endDate: Date): number {
	return (endDate.getTime() - startDate.getTime()) / MS_PER_YEAR;
}
