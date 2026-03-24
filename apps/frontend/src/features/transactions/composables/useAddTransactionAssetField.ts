import { onBeforeUnmount, ref, watch, type Ref } from 'vue';
import type {
	AssetSearchItem,
	AssetWithQuoteResponse,
	CurrencyType,
	TransactionType,
} from '@atlas/types';
import { assetsRepository } from '@/features/assets/api/assetsRepository';
import { getErrorMessage } from '@/shared/api/errorMessage';
import { isTradeTransactionType } from '../constants/transactionTypes';

const DEBOUNCE_MS = 400;

export type AssetSearchSuggestion = AssetSearchItem & { label: string };

function formatAssetLabel(ticker: string, name: string): string {
	return `${ticker} — ${name}`;
}

function isAssetSearchSuggestion(val: unknown): val is AssetSearchSuggestion {
	if (val === null || typeof val !== 'object') return false;
	if (!('ticker' in val) || !('label' in val)) return false;
	const o = val as Record<string, unknown>;
	return typeof o.ticker === 'string' && typeof o.label === 'string';
}

export type AddTransactionAssetFieldDeps = {
	transactionType: Ref<TransactionType>;
	assetId: Ref<string | null>;
	price: Ref<number>;
	currency: Ref<CurrencyType>;
	submitError: Ref<string>;
};

export function useAddTransactionAssetField(deps: AddTransactionAssetFieldDeps) {
	const { transactionType, assetId, price, currency, submitError } = deps;
	const assetSearchValue = ref<string | AssetSearchSuggestion | null>(null);
	const searchSuggestions = ref<AssetSearchSuggestion[]>([]);
	const assetsSearchLoading = ref(false);
	const assetSelectLoading = ref(false);
	const selectedAsset = ref<AssetWithQuoteResponse | null>(null);

	let searchDebounceId: ReturnType<typeof setTimeout> | null = null;
	/** Инкремент при новом выборе/сбросе — ответы устаревших запросов `ensureFromExchange` игнорируются. */
	let assetSelectSeq = 0;

	function clearSearchDebounce(): void {
		if (searchDebounceId !== null) {
			clearTimeout(searchDebounceId);
			searchDebounceId = null;
		}
	}

	function invalidatePendingAssetSelect(): void {
		assetSelectSeq++;
	}

	watch(transactionType, (t) => {
		if (!isTradeTransactionType(t)) {
			invalidatePendingAssetSelect();
			assetSelectLoading.value = false;
			assetId.value = null;
			assetSearchValue.value = null;
			selectedAsset.value = null;
		}
	});

	async function onAssetSelect(item: AssetSearchSuggestion) {
		if (!item?.ticker) return;

		const seq = ++assetSelectSeq;
		assetSelectLoading.value = true;
		submitError.value = '';
		try {
			const asset = await assetsRepository.ensureFromExchange(item.ticker);
			if (seq !== assetSelectSeq) return;

			selectedAsset.value = asset;
			assetId.value = asset.id;
			if (asset.quote) {
				price.value = asset.quote.price;
				currency.value = asset.quote.currency;
			}
			assetSearchValue.value = {
				...item,
				label: formatAssetLabel(asset.ticker, asset.name),
			};
		} catch (err: unknown) {
			if (seq !== assetSelectSeq) return;
			submitError.value = getErrorMessage(err, 'Не удалось добавить бумагу');
			assetSearchValue.value = null;
		} finally {
			if (seq === assetSelectSeq) {
				assetSelectLoading.value = false;
			}
		}
	}

	watch(assetSearchValue, async (val) => {
		if (val === null || val === undefined || val === '') {
			if (selectedAsset.value !== null || assetId.value !== null) {
				onAssetClear();
			}
			return;
		}
		if (isAssetSearchSuggestion(val) && selectedAsset.value?.ticker !== val.ticker) {
			await onAssetSelect(val);
		}
	});

	function onAssetSearch(event: { query: string }) {
		const query = event.query?.trim() ?? '';
		if (!query) {
			searchSuggestions.value = [];
			return;
		}

		clearSearchDebounce();
		searchDebounceId = setTimeout(async () => {
			assetsSearchLoading.value = true;
			try {
				const items = await assetsRepository.search(query);
				searchSuggestions.value = items.map((item) => ({
					...item,
					label: formatAssetLabel(item.ticker, item.name),
				}));
			} finally {
				assetsSearchLoading.value = false;
				searchDebounceId = null;
			}
		}, DEBOUNCE_MS);
	}

	function onAssetClear() {
		invalidatePendingAssetSelect();
		assetSelectLoading.value = false;
		assetSearchValue.value = null;
		selectedAsset.value = null;
		assetId.value = null;
	}

	function resetAssetField() {
		invalidatePendingAssetSelect();
		assetSelectLoading.value = false;
		clearSearchDebounce();
		assetSearchValue.value = null;
		searchSuggestions.value = [];
		selectedAsset.value = null;
	}

	onBeforeUnmount(() => {
		invalidatePendingAssetSelect();
		clearSearchDebounce();
	});

	return {
		assetSearchValue,
		searchSuggestions,
		assetsSearchLoading,
		assetSelectLoading,
		selectedAsset,
		onAssetSearch,
		onAssetClear,
		resetAssetField,
	};
}
