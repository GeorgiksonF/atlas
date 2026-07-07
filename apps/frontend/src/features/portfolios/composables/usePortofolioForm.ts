import { MaybeRefOrGetter, ref, toValue, watch } from 'vue';

import { PortfolioResponse } from '@atlas/types';

import { getErrorMessage } from '@/shared/api/errorMessage';
import { useAppToast } from '@utils';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import { PortfolioForm, portfolioFormSchema } from '../schemas/portfolioFormSchemas';
import { PortfolioContext, usePortfoliosStore } from '../stores/portfoliosStore';

interface Props {
	portfolio?: MaybeRefOrGetter<PortfolioContext | null>;
	submit: (res: PortfolioForm) => Promise<PortfolioResponse>;
	onSuccess?: () => void;
}

const portfolioInitial = (): PortfolioForm => ({
	name: '',
	category: null,
	broker: null,
});

export const usePortfolioForm = (props: Props) => {
	const { portfolio, submit, onSuccess } = props;

	const toast = useAppToast();
	const store = usePortfoliosStore();
	const loading = ref(false);

	const { handleSubmit, values, meta, resetForm } = useForm({
		validationSchema: toTypedSchema(portfolioFormSchema),
		initialValues: portfolioInitial(),
	});

	const save = handleSubmit(async (form) => {
		loading.value = true;

		try {
			await submit(form);
			await store.fetchPortfolios();
			onSuccess?.();
			toast.success('Портфель создан');
		} catch (err) {
			toast.error(getErrorMessage(err, 'Не удалось изменить портфель'));
		} finally {
			loading.value = false;
		}
	});

	const toFormValues = (p: PortfolioContext | null): PortfolioForm => ({
		name: p?.name ?? '',
		broker: p?.broker ?? null,
		category: p?.category ?? null,
	});

	watch(
		() => toValue(portfolio),
		(p) => {
			resetForm({ values: toFormValues(p ?? null) });
		},
		{ immediate: true },
	);

	return { save, loading, meta, portfolioForm: values };
};
