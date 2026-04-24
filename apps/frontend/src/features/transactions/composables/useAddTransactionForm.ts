import { useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import type { CurrencyType, TransactionType } from '@atlas/types';
import {
	addTransactionSchema,
	type AddTransactionFormValues,
} from '../schemas/addTransactionSchema';

function defaultFormValues(): AddTransactionFormValues {
	return {
		type: 'BUY',
		assetId: null,
		quantity: 1,
		price: 0,
		currency: 'RUB',
		date: new Date(),
	};
}

export function useAddTransactionForm() {
	const { handleSubmit, resetForm: resetVeeForm, meta } = useForm({
		validationSchema: toTypedSchema(addTransactionSchema),
		initialValues: defaultFormValues(),
	});

	const type = useField<TransactionType>('type');
	const assetId = useField<string | null>('assetId');
	const quantity = useField<number>('quantity');
	const price = useField<number>('price');
	const currency = useField<CurrencyType>('currency');
	const date = useField<Date | null>('date');

	return {
		handleSubmit,
		resetVeeForm,
		meta,
		defaultFormValues,
		transactionType: type.value,
		transactionTypeError: type.errorMessage,
		assetId: assetId.value,
		assetIdError: assetId.errorMessage,
		quantity: quantity.value,
		quantityError: quantity.errorMessage,
		price: price.value,
		priceError: price.errorMessage,
		currency: currency.value,
		currencyError: currency.errorMessage,
		date: date.value,
		dateError: date.errorMessage,
	};
}
