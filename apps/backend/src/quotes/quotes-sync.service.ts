import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { AssetsService } from '../assets/assets.service';
import {
	IQuoteProvider,
	QUOTE_PROVIDER,
} from './contract/quote-provider.interface';
import { QuoteRepository } from './persistence/quote.repository';

@Injectable()
export class QuotesSyncService {
	constructor(
		private readonly assetsService: AssetsService,
		private readonly quoteRepository: QuoteRepository,
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
			await this.quoteRepository.upsertForAsset(asset.id, {
				price: q.price,
				currency: q.currency,
			});
		}
	}
}
