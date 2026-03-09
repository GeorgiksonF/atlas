import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getErrorMessage } from '@/shared/api/errorMessage';
import { portfoliosRepository } from '@/features/portfolios/api/portfoliosRepository';
import { usePortfoliosStore } from '@/features/portfolios/stores/portfoliosStore';
import { PORTFOLIO_CATEGORY_LABELS } from '@/features/portfolios/constants/categories';
import type { PortfolioCategory, PortfolioResponse } from '@atlas/types';
import { validatePortfolioName } from '@/features/portfolios/utils/createPortfolioValidation';

const CATEGORIES: { value: PortfolioCategory; label: string }[] = Object.entries(
	PORTFOLIO_CATEGORY_LABELS,
).map(([value, label]) => ({ value: value as PortfolioCategory, label }));

export function useEditPortfolio() {
	const route = useRoute();
	const router = useRouter();
	const toast = useToast();
	const portfoliosStore = usePortfoliosStore();

	const portfolioId = computed(() => route.params.id as string);

	const name = ref('');
	const category = ref<PortfolioCategory | null>(null);
	const broker = ref<string | null>(null);

	const brokers = ref<string[]>([]);
	const brokersLoading = ref(false);
	const brokersError = ref('');
	const portfolioLoading = ref(false);
	const portfolioError = ref('');
	const saving = ref(false);
	const submitError = ref('');

	const nameError = computed(() => validatePortfolioName(name.value));

	const brokerOptions = computed(() =>
		brokers.value.map((b) => ({ value: b, label: b })),
	);

	const canSave = computed(
		() =>
			!nameError.value &&
			name.value.trim() !== '' &&
			category.value != null &&
			broker.value != null,
	);

	function applyPortfolio(p: PortfolioResponse): void {
		name.value = p.name;
		category.value = p.category;
		broker.value = p.broker ?? null;
	}

	async function loadPortfolio(): Promise<void> {
		const id = portfolioId.value;
		if (!id) return;
		portfolioLoading.value = true;
		portfolioError.value = '';
		try {
			const p = await portfoliosRepository.getById(id);
			applyPortfolio(p);
		} catch (err: unknown) {
			portfolioError.value = getErrorMessage(err, 'Не удалось загрузить портфель');
			toast.add({
				severity: 'error',
				summary: 'Ошибка',
				detail: portfolioError.value,
				life: 5000,
			});
		} finally {
			portfolioLoading.value = false;
		}
	}

	async function loadBrokers(): Promise<void> {
		brokersLoading.value = true;
		brokersError.value = '';
		try {
			brokers.value = await portfoliosRepository.getBrokers();
		} catch (err: unknown) {
			brokers.value = [];
			brokersError.value = getErrorMessage(err, 'Не удалось загрузить список брокеров');
		} finally {
			brokersLoading.value = false;
		}
	}

	async function save(): Promise<void> {
		const id = portfolioId.value;
		if (!id || !canSave.value) return;
		const nameTrim = name.value.trim();
		submitError.value = '';
		saving.value = true;
		try {
			await portfoliosRepository.update(id, {
				name: nameTrim,
				category: category.value!,
				broker: broker.value || undefined,
			});
			await portfoliosStore.fetchPortfolios();
			toast.add({
				severity: 'success',
				summary: 'Портфель обновлён',
				life: 3000,
			});
			await router.push({ name: 'portfolioManagement' });
		} catch (err: unknown) {
			submitError.value = getErrorMessage(err, 'Не удалось сохранить изменения');
			toast.add({
				severity: 'error',
				summary: 'Ошибка',
				detail: submitError.value,
				life: 5000,
			});
		} finally {
			saving.value = false;
		}
	}

	function goBack(): void {
		router.back();
	}

	watch(
		portfolioId,
		(id) => {
			if (id) loadPortfolio();
		},
		{ immediate: true },
	);

	watch(
		() => portfolioLoading.value,
		(loading) => {
			if (!loading && !portfolioError.value) loadBrokers();
		},
	);

	return {
		portfolioId,
		name,
		category,
		broker,
		brokers,
		brokersLoading,
		brokersError,
		portfolioLoading,
		portfolioError,
		saving,
		submitError,
		nameError,
		categories: CATEGORIES,
		brokerOptions,
		canSave,
		loadPortfolio,
		loadBrokers,
		save,
		goBack,
	};
}
