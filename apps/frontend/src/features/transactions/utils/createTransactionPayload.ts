import type { CreateTransaction } from '@atlas/types';
import { isTradeTransactionType } from '../constants/transactionTypes';
import type { AddTransactionFormValues } from '../schemas/addTransactionSchema';

export function createTransactionPayload(
	formValues: AddTransactionFormValues,
): CreateTransaction {
	const isTrade = isTradeTransactionType(formValues.type);
	const dateVal = formValues.date;
	return {
		type: formValues.type,
		quantity: isTrade ? formValues.quantity : 1,
		price: formValues.price,
		currency: formValues.currency,
		date: (
			dateVal instanceof Date
				? dateVal
				: dateVal
					? new Date(dateVal)
					: new Date()
		).toISOString(),
		assetId: isTrade ? (formValues.assetId ?? null) : null,
	};
}
