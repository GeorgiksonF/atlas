import { computed, getCurrentScope, onScopeDispose, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppToast } from '@utils';
import { getErrorMessage } from '@/shared/api/errorMessage';
import type { PortfolioCategory } from '@atlas/types';
import {
	STEPS,
	canProceedToNext,
	canSubmitForm,
	clampStepNext,
	clampStepPrev,
	getDefaultName,
	validatePortfolioName,
	usePortfoliosStore,
	portfoliosRepository,
	PORTFOLIO_CATEGORIES
} from '@features/portfolios';

export function useCreatePortfolio() {
	const router = useRouter();
	const toast = useAppToast();
	const store = usePortfoliosStore();

	const scope = getCurrentScope();
	const cancelled = ref(false);
	if (scope) {
		onScopeDispose(() => {
			cancelled.value = true;
		});
	}

	const step = ref(1);
	const category = ref<PortfolioCategory | null>(null);
	const broker = ref<string | null>(null);
	const name = ref('');
	const brokers = ref<string[]>([]);
	const brokersLoading = ref(false);
	const brokersError = ref('');
	const loading = ref(false);
	const submitError = ref('');

	const nameError = computed(() => validatePortfolioName(name.value));

	const canProceed = computed(() => canProceedToNext(step.value, category.value, broker.value));

	const canSubmit = computed(() =>
		canSubmitForm(nameError.value, name.value.trim(), category.value, broker.value),
	);

	function applyDefaultNameFromBroker(): void {
		name.value = getDefaultName(name.value, broker.value);
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

	watch(step, (s) => {
		if (s === STEPS.BROKER && brokers.value.length === 0) loadBrokers();
		if (s === STEPS.NAME) applyDefaultNameFromBroker();
	});

	async function onSubmit(): Promise<void> {
		if (!canSubmit.value) return;
		const nameTrim = name.value.trim();
		submitError.value = '';
		loading.value = true;
		try {
			await portfoliosRepository.create({
				name: nameTrim,
				category: category.value!,
				broker: broker.value || undefined,
			});
			if (cancelled.value) return;
			await store.fetchPortfolios();
			if (cancelled.value) return;
			toast.success('Портфель создан');
			await router.push({ name: 'portfolio' });
		} catch (err: unknown) {
			if (cancelled.value) return;
			submitError.value = getErrorMessage(err, 'Не удалось создать портфель');
			toast.error('Ошибка');
		} finally {
			loading.value = false;
		}
	}

	function nextStep(): void {
		step.value = clampStepNext(step.value);
	}

	function prevStep(): void {
		step.value = clampStepPrev(step.value);
	}

	return {
		STEPS,
		step,
		category,
		broker,
		name,
		brokers,
		brokersLoading,
		brokersError,
		loading,
		submitError,
		categories: PORTFOLIO_CATEGORIES,
		nameError,
		canProceed,
		canSubmit,
		loadBrokers,
		onSubmit,
		nextStep,
		prevStep,
	};
}
