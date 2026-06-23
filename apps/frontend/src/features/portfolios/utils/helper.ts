import { PortfolioCategory } from '@atlas/types';

import { PORTFOLIO_CATEGORY_LABELS } from '../constants/constants';

export const getPortfolioCategoryLabel = (category: PortfolioCategory) => {
	return PORTFOLIO_CATEGORY_LABELS[category] ?? '';
};
