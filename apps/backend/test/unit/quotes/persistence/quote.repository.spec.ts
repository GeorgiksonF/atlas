import { QuoteRepository } from '@/quotes/persistence/quote.repository';

jest.mock('@atlas/database', () => ({
	PrismaClient: jest.fn(),
}));

const ASSET_ID = 'asset-1';

describe('QuoteRepository', () => {
	let repository: QuoteRepository;
	let prisma: { quote: { upsert: jest.Mock } };

	beforeEach(() => {
		prisma = {
			quote: {
				upsert: jest.fn().mockResolvedValue(undefined),
			},
		};
		repository = new QuoteRepository(prisma as never);
	});

	it('вызывает prisma.quote.upsert с create и update', async () => {
		await repository.upsertForAsset(ASSET_ID, {
			price: 250.5,
			currency: 'RUB',
		});

		expect(prisma.quote.upsert).toHaveBeenCalledWith({
			where: { assetId: ASSET_ID },
			create: {
				assetId: ASSET_ID,
				price: 250.5,
				currency: 'RUB',
			},
			update: {
				price: 250.5,
				currency: 'RUB',
			},
		});
	});

	it('сохраняет currency из input без подмены', async () => {
		await repository.upsertForAsset(ASSET_ID, {
			price: 100,
			currency: 'USD',
		});

		expect(prisma.quote.upsert).toHaveBeenCalledWith({
			where: { assetId: ASSET_ID },
			create: {
				assetId: ASSET_ID,
				price: 100,
				currency: 'USD',
			},
			update: {
				price: 100,
				currency: 'USD',
			},
		});
	});
});
