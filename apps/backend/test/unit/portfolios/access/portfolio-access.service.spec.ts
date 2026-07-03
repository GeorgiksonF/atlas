import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { PortfolioAccessService } from '@/portfolios/access/portfolio-access.service';
import { PORTFOLIO_ERROR_MESSAGES } from '@/portfolios/constants/messages';

jest.mock('@atlas/database', () => ({
	PrismaClient: jest.fn(),
}));

const PORTFOLIO_ID = 'portfolio-1';
const OWNER_ID = 'user-owner';
const OTHER_USER_ID = 'user-other';

type PortfolioRow = {
	id: string;
	userId: string;
	name: string;
	description: string | null;
	category: string;
	broker: string | null;
	createdAt: Date;
	updatedAt: Date;
};

const createPortfolio = (userId: string): PortfolioRow => ({
	id: PORTFOLIO_ID,
	userId,
	name: 'Test Portfolio',
	description: null,
	category: 'INVESTMENTS',
	broker: null,
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-01'),
});

describe('PortfolioAccessService', () => {
	let service: PortfolioAccessService;
	let prisma: { portfolio: { findUnique: jest.Mock } };

	beforeEach(() => {
		prisma = {
			portfolio: {
				findUnique: jest.fn(),
			},
		};
		service = new PortfolioAccessService(prisma as never);
	});

	it('возвращает портфель, если userId совпадает с владельцем', async () => {
		const portfolio = createPortfolio(OWNER_ID);
		prisma.portfolio.findUnique.mockResolvedValue(portfolio);

		await expect(service.assertOwned(PORTFOLIO_ID, OWNER_ID)).resolves.toBe(
			portfolio,
		);
		expect(prisma.portfolio.findUnique).toHaveBeenCalledWith({
			where: { id: PORTFOLIO_ID },
		});
	});

	it('бросает ForbiddenException, если портфель принадлежит другому пользователю', async () => {
		prisma.portfolio.findUnique.mockResolvedValue(
			createPortfolio(OWNER_ID),
		);

		await expect(
			service.assertOwned(PORTFOLIO_ID, OTHER_USER_ID),
		).rejects.toThrow(ForbiddenException);
		await expect(
			service.assertOwned(PORTFOLIO_ID, OTHER_USER_ID),
		).rejects.toThrow(PORTFOLIO_ERROR_MESSAGES.PORTFOLIO_ACCESS_DENIED);
	});

	it('бросает NotFoundException, если портфель не найден', async () => {
		prisma.portfolio.findUnique.mockResolvedValue(null);

		await expect(
			service.assertOwned(PORTFOLIO_ID, OWNER_ID),
		).rejects.toThrow(NotFoundException);
		await expect(
			service.assertOwned(PORTFOLIO_ID, OWNER_ID),
		).rejects.toThrow(PORTFOLIO_ERROR_MESSAGES.PORTFOLIO_NOT_FOUND);
	});
});
