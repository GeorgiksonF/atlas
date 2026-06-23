import { z } from 'zod';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_BROKERS } from '@atlas/types';

export const portfolioFormSchema = z.object({
	category: z.nullable(z.enum(PORTFOLIO_CATEGORIES).refine((v) => v !== null)),
	broker: z.nullable(z.enum(PORTFOLIO_BROKERS).refine((v) => v !== null)),
	name: z.string().trim().min(1, 'Введите название вашего портфеля'),
});

export type PortfolioForm = z.infer<typeof portfolioFormSchema>;
