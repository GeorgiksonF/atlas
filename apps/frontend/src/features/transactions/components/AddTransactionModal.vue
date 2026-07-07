<template>
	<AppDialog
		v-model:visible="visible"
		title="Добавить сделку"
		@after-hide="resetForm"
	>
		<form
			id="add-transaction-form"
			class="flex flex-col gap-4"
			@submit.prevent="onSubmit"
		>
			<FormItem label="Тип операции" :error="transactionTypeError">
				<SelectButton
					v-model="transactionType"
					:options="typeOptions"
					option-label="label"
					option-value="value"
				/>
			</FormItem>

			<FormItem v-if="isTradeType" label="Актив" :error="assetIdError">
				<AutoComplete
					v-model="assetSearchValue"
					:suggestions="searchSuggestions"
					option-label="label"
					placeholder="Введите тикер или название"
					:loading="assetsSearchLoading || assetSelectLoading"
					fluid
					show-clear
					empty-message="Ничего не найдено"
					@complete="onAssetSearch"
					@clear="onAssetClear"
				/>
				<small v-if="selectedAsset" class="text-slate-400">
					Тикер: {{ selectedAsset.ticker }}
				</small>
			</FormItem>

			<FormItem v-if="isTradeType" label="Количество" :error="quantityError">
				<InputNumber
					v-model="quantity"
					:min-fraction-digits="0"
					:max-fraction-digits="4"
					:min="0.0001"
					class="w-full"
				/>
			</FormItem>

			<FormItem
				:label="isTradeType ? 'Цена за единицу' : 'Сумма'"
				:error="priceError"
			>
				<InputNumber
					v-model="price"
					:min-fraction-digits="2"
					:max-fraction-digits="2"
					:min="0.01"
					class="w-full"
				/>
			</FormItem>

			<FormItem label="Валюта сделки" :error="currencyError">
				<Select
					v-model="currency"
					:options="currencyOptions"
					option-label="label"
					option-value="value"
					placeholder="Выберите валюту"
					class="w-full"
				/>
			</FormItem>

			<FormItem label="Дата" :error="dateError">
				<DatePicker
					v-model="date"
					date-format="dd.mm.yy"
					show-icon
					class="w-full"
				/>
			</FormItem>

			<Message
				v-if="!currentPortfolioId"
				severity="warn"
				variant="simple"
				class="w-full"
				:closable="false"
			>
				Нет активного портфеля — выберите портфель в боковой панели или создайте новый.
			</Message>

			<Message v-if="submitError" severity="error" class="w-full" :closable="false">
				{{ submitError }}
			</Message>
		</form>

		<template #footer>
			<div class="flex justify-end gap-2">
				<Button
					label="Отмена"
					type="button"
					severity="secondary"
					@click="visible = false"
				/>
				<Button
					label="Добавить"
					type="submit"
					form="add-transaction-form"
					:loading="loading"
					:disabled="!currentPortfolioId || !meta.valid"
				/>
			</div>
		</template>
	</AppDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import AppDialog from '@/shared/components/AppDialog.vue';
import FormItem from '@/shared/components/FormItem.vue';

import { useAddTransactionAssetField } from '../composables/useAddTransactionAssetField';
import { useAddTransactionForm } from '../composables/useAddTransactionForm';
import { useCreateTransaction } from '../composables/useCreateTransaction';
import { CURRENCY_LABELS, CURRENCY_TYPES } from '../constants/currency';
import {
	isTradeTransactionType,
	TRANSACTION_TYPE_LABELS,
	TRANSACTION_TYPES,
} from '../constants/transactionTypes';

const visible = defineModel<boolean>('visible', { required: true });

const {
	handleSubmit,
	resetVeeForm,
	meta,
	defaultFormValues,
	transactionType,
	transactionTypeError,
	assetId,
	assetIdError,
	quantity,
	quantityError,
	price,
	priceError,
	currency,
	currencyError,
	date,
	dateError,
} = useAddTransactionForm();

const { loading, submitError, createTransaction } = useCreateTransaction();

const {
	assetSearchValue,
	searchSuggestions,
	assetsSearchLoading,
	assetSelectLoading,
	selectedAsset,
	onAssetSearch,
	onAssetClear,
	resetAssetField,
} = useAddTransactionAssetField({
	transactionType,
	assetId,
	price,
	currency,
	submitError,
});

const store = usePortfoliosStore();

const currentPortfolioId = computed(() => {
	const id = store.activePortfolio.id;
	if (id && id !== 'all') return id;
	return null;
});

const typeOptions = computed(() =>
	TRANSACTION_TYPES.map((value) => ({
		label: TRANSACTION_TYPE_LABELS[value],
		value,
	})),
);

const currencyOptions = computed(() =>
	CURRENCY_TYPES.map((value) => ({
		label: CURRENCY_LABELS[value],
		value,
	})),
);

const isTradeType = computed(() =>
	isTradeTransactionType(transactionType.value),
);

function resetForm() {
	resetVeeForm({ values: defaultFormValues() });
	resetAssetField();
	submitError.value = '';
}

const onSubmit = handleSubmit(async (formValues) => {
	if (!currentPortfolioId.value) return;

	const isCreated = await createTransaction(currentPortfolioId.value, formValues);

	if (isCreated) {
		visible.value = false;
	}
});
</script>
