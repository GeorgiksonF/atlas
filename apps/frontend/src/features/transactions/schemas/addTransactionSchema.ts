import { z } from 'zod';
import type { CurrencyType, TransactionType } from '@atlas/types';
import { CURRENCY_TYPES } from '../constants/currency';
import {
	isTradeTransactionType,
	TRANSACTION_TYPES,
} from '../constants/transactionTypes';

const transactionTypeEnum = z.enum(
	TRANSACTION_TYPES as [TransactionType, ...TransactionType[]],
);
const currencyEnum = z.enum(
	CURRENCY_TYPES as [CurrencyType, ...CurrencyType[]],
);

export const addTransactionSchema = z
	.object({
		type: transactionTypeEnum,
		assetId: z.string().uuid().nullable(),
		quantity: z.coerce.number(),
		price: z.coerce.number(),
		currency: currencyEnum,
		date: z
			.union([z.date(), z.null()])
			.refine((d) => d !== null && !Number.isNaN(d.getTime()), {
				message: 'Укажите дату',
			}),
	})
	.superRefine((data, ctx) => {
		const isTrade = isTradeTransactionType(data.type);
		if (isTrade) {
			if (!data.assetId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Выберите актив',
					path: ['assetId'],
				});
			}
			if (!Number.isFinite(data.quantity) || data.quantity <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Укажите количество больше нуля',
					path: ['quantity'],
				});
			}
		}
		if (!Number.isFinite(data.price) || data.price <= 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Укажите сумму больше нуля',
				path: ['price'],
			});
		}
	});

export type AddTransactionFormValues = z.infer<typeof addTransactionSchema>;
