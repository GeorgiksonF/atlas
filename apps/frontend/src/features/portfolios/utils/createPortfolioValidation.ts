import type { PortfolioCategory } from '@atlas/types';

export const STEPS = { TYPE: 1, BROKER: 2, NAME: 3 } as const;

const EMPTY_NAME_ERROR = 'Введите название';

export function validatePortfolioName(name: string): string {
	const trimmed = name.trim();
	return trimmed ? '' : EMPTY_NAME_ERROR;
}

export function canProceedToNext(
	step: number,
	category: PortfolioCategory | null,
	broker: string | null,
): boolean {
	if (step === STEPS.TYPE) return category != null;
	if (step === STEPS.BROKER) return broker != null;
	return false;
}

export function canSubmitForm(
	nameError: string,
	nameTrim: string,
	category: PortfolioCategory | null,
	broker: string | null,
): boolean {
	return (
		!nameError &&
		nameTrim !== '' &&
		category != null &&
		broker != null
	);
}

export function getDefaultName(currentName: string, broker: string | null): string {
	return broker && !currentName.trim() ? broker : currentName;
}

export function clampStepNext(step: number): number {
	return Math.min(STEPS.NAME, step + 1);
}

export function clampStepPrev(step: number): number {
	return Math.max(STEPS.TYPE, step - 1);
}
