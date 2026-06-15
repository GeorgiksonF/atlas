import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { useAppToast } from '@utils';
import { z } from 'zod';
import { usePortfoliosStore, portfoliosRepository } from '@features/portfolios';
import { getErrorMessage } from '@/shared/api/errorMessage';
import { toTypedSchema } from '@vee-validate/zod';
import { BrokerResponse, PortfolioBroker, PortfolioCategory } from '@atlas/types';

export const STEPS = { TYPE: 1, BROKER: 2, NAME: 3 } as const;

export function useCreatePortfolio() {
	const router = useRouter();
	const toast = useAppToast();
	const store = usePortfoliosStore();

	const category = ref<PortfolioCategory | null>(null);
	const broker = ref<PortfolioBroker | null>(null);

	const { handleSubmit, meta, setFieldValue } = useForm({
		validationSchema: toTypedSchema(
			z.object({
				name: z.string().trim().min(1, 'Введите название вашего портфеля'),
			}),
		),
		initialValues: {
			name: '',
		},
	});

	const step = ref(1);
	const isLoading = ref(false);
	const brokers = ref<BrokerResponse[]>([]);

	const canProceed = computed(() => {
		if (step.value === STEPS.TYPE) return category.value != null;
		if (step.value === STEPS.BROKER) return broker.value != null;
		return false;
	});

	const loading = ref(false);

	const onSubmit = handleSubmit(async (formValues) => {
		loading.value = true;

		try {
			await portfoliosRepository.create({
				name: formValues.name,
				broker: broker.value ?? undefined,
				category: category.value ?? undefined,
			});

			await store.fetchPortfolios();

			toast.success('Портфель создан');

			await router.push({ name: 'portfolio' });
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Не удалось создать портфель'));
		} finally {
			loading.value = false;
		}
	});

	const nextStep = async () => (step.value = Math.min(STEPS.NAME, ++step.value));
	const prevStep = () => (step.value = Math.max(STEPS.TYPE, --step.value));

	const loadBrokers = async (): Promise<void> => {
		isLoading.value = true;
		try {
			brokers.value = await portfoliosRepository.getBrokers();
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, 'Не удалось загрузить список брокеров'));
		} finally {
			isLoading.value = false;
		}
	};

	onMounted(() => loadBrokers());

	watch(step, (s) => {
		if (s !== STEPS.NAME) return;

		const label = brokers.value.find((b) => b.value === broker.value)?.label;

		if (label) {
			setFieldValue('name', label);
		}
	});

	return {
		STEPS,
		step,
		loading,
		meta,
		canProceed,
		category,
		broker,
		brokers,
		onSubmit,
		nextStep,
		prevStep,
	};
}
