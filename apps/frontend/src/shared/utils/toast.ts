import { useToast } from 'primevue/usetoast';

/**
 * Опции, пробрасываемые в `createToast` из uikit
 */
export interface ToastOptions {
	/**
	 * Описание тоста
	 */
	detail?: string;
	/**
	 * Время жизни тоста
	 */
	life?: number;
}

function buildCreateToastArgs(
	severity: 'success' | 'error' | 'info',
	summary: string,
	options?: ToastOptions,
) {
	const { detail, life } = options ?? {};

	return {
		severity,
		summary,
		life: life ?? 3000,
		...(detail ? { detail } : {}),
	};
}

/**
 * Статический класс для отображения тостов.
 *
 * Фасад над useToast из primevue.
 */
export function useAppToast() {
	const toast = useToast();

	return {
		success: (summary: string, options?: ToastOptions) =>
			toast.add(buildCreateToastArgs('success', summary, options)),
		error: (summary: string, options?: ToastOptions) =>
			toast.add(buildCreateToastArgs('error', summary, options)),
		info: (summary: string, options?: ToastOptions) =>
			toast.add(buildCreateToastArgs('info', summary, options)),
	};
}
