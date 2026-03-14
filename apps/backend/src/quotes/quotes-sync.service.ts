import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaClient } from '@atlas/database';
import {
	IQuoteProvider,
	QUOTE_PROVIDER,
} from './contract/quote-provider.interface';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class QuotesSyncService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly assetsService: AssetsService,
		@Inject(QUOTE_PROVIDER) private readonly quoteProvider: IQuoteProvider,
	) {}

	@Cron('*/10 * * * *')
	async runScheduledSync(): Promise<void> {
		await this.sync();
	}

	async sync(): Promise<void> {
		const assets = await this.assetsService.findAll();
		if (assets.length === 0) return;
		const tickers = assets.map((a) => a.ticker);
		const quotes = await this.quoteProvider.getQuotes(tickers);
		const tickerToAsset = new Map(assets.map((a) => [a.ticker, a]));
		for (const q of quotes) {
			const asset = tickerToAsset.get(q.ticker);
			if (!asset) continue;
			await this.prisma.quote.upsert({
				where: { assetId: asset.id },
				create: {
					assetId: asset.id,
					price: q.price,
					currency: 'RUB',
				},
				update: {
					price: q.price,
					currency: 'RUB',
				},
			});
		}
	}
}
