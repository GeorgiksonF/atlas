import type { TransactionType } from '@atlas/types';

/** Подписи UI — единственный перечень ключей типов сделки для фичи. */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
	BUY: 'Покупка',
	SELL: 'Продажа',
	DEPOSIT: 'Внесение',
	WITHDRAWAL: 'Вывод',
};

/** Порядок совпадает с объявлением `TRANSACTION_TYPE_LABELS`. */
export const TRANSACTION_TYPES = Object.keys(
	TRANSACTION_TYPE_LABELS,
) as TransactionType[];

/** Покупка / продажа — нужен актив. */
export const TRADE_TRANSACTION_TYPES = ['BUY', 'SELL'] as const satisfies readonly TransactionType[];

export function isTradeTransactionType(type: TransactionType): boolean {
	return TRADE_TRANSACTION_TYPES.some((t) => t === type);
}
