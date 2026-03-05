import type { PortfolioCategory } from '@atlas/types';

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
	INVESTMENTS: 'Инвестиции',
	CRYPTO: 'Криптовалюта',
} as const;

export function getPortfolioCategoryLabel(category: PortfolioCategory): string {
	return PORTFOLIO_CATEGORY_LABELS[category];
}
