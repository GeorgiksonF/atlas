import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import type { AssetWithQuoteResponse, QuoteProviderItem } from '@atlas/types';

import { AssetsService } from '../assets/assets.service';
import { MoexSearchService } from '../integrations/moex/moex-search.service';
import type { IQuoteProvider } from '../quotes/contract/quote-provider.interface';
import { QUOTE_PROVIDER } from '../quotes/contract/quote-provider.interface';
import { QuoteRepository } from '../quotes/persistence/quote.repository';

@Injectable()
export class AssetsFromExchangeService {
	constructor(
		private readonly assetsService: AssetsService,
		private readonly moexSearch: MoexSearchService,
		private readonly quoteRepository: QuoteRepository,
		@Inject(QUOTE_PROVIDER) private readonly quoteProvider: IQuoteProvider,
	) {}

	async ensureFromExchange(ticker: string): Promise<AssetWithQuoteResponse> {
		const normalized = ticker.trim().toUpperCase();
		if (!normalized) {
			throw new BadRequestException('Тикер не указан');
		}

		const existing =
			await this.assetsService.findByTickerWithQuote(normalized);
		if (existing) {
			return existing;
		}

		const results = await this.moexSearch.search(normalized);
		const moexItem = results.find((r) => r.ticker === normalized);
		if (!moexItem) {
			throw new NotFoundException(
				`Бумага с тикером ${normalized} не найдена на бирже`,
			);
		}

		const asset = await this.assetsService.createFromExchangeItem(moexItem);

		const quotes = await this.quoteProvider.getQuotes([asset.ticker]);
		const quoteItem: QuoteProviderItem | undefined = quotes[0];
		if (quoteItem) {
			await this.quoteRepository.upsertForAsset(asset.id, {
				price: quoteItem.price,
				currency: quoteItem.currency,
			});
		}

		const withQuote = await this.assetsService.findByTickerWithQuote(
			asset.ticker,
		);
		if (withQuote) {
			return withQuote;
		}

		return { ...asset };
	}
}
