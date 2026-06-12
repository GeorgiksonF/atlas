import type { PortfolioCategory } from '@atlas/types';

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
    INVESTMENTS: 'Инвестиции',
    CRYPTO: 'Криптовалюта',
}

	
export const PORTFOLIO_CATEGORIES = Object.entries(PORTFOLIO_CATEGORY_LABELS)
    .map(([value, label]) => ({ value: value, label }));