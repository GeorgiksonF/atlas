import type { CurrencyType } from '@atlas/types';

const LOCALE_BY_CURRENCY: Record<CurrencyType, string> = {
	RUB: 'ru-RU',
	USD: 'en-US',
};

export const formatMoney = (amount: number, currency: CurrencyType, hasSign: boolean = true) => {
	const absoluteAmount = Math.abs(amount);
	const isNegativeAmount = amount < 0;

	const currencyLocale = LOCALE_BY_CURRENCY[currency];
	const formatted = new Intl.NumberFormat(currencyLocale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(absoluteAmount);

	if (!hasSign) {
		return `${isNegativeAmount ? '−' : ''}${formatted}`;
	}

	if (amount > 0) {
		return `+${formatted}`;
	}

	if (amount < 0) {
		return `−${formatted}`;
	}

	return `${formatted}`;
};

export function formatPercent(value: number, hasSign: boolean = true): string {
	const absoluteValue = Math.abs(value);
	const formatted = new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(absoluteValue);

	if (!hasSign) {
		return `${value < 0 ? '−' : ''}${formatted}%`;
	}

	if (value > 0) {
		return `+${formatted}%`;
	}

	if (value < 0) {
		return `−${formatted}%`;
	}

	return `${formatted}%`;
}
