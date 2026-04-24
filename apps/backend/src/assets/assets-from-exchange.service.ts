import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient, type Asset } from '@atlas/database';
import type { AssetWithQuoteResponse, QuoteProviderItem } from '@atlas/types';
import type { IQuoteProvider } from '../quotes/contract/quote-provider.interface';
import { QUOTE_PROVIDER } from '../quotes/contract/quote-provider.interface';
import { MoexSearchService } from './moex-search.service';

type AssetWithQuoteRow = Prisma.AssetGetPayload<{ include: { quote: true } }>;

@Injectable()
export class AssetsFromExchangeService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly moexSearch: MoexSearchService,
		@Inject(QUOTE_PROVIDER) private readonly quoteProvider: IQuoteProvider,
	) {}

	async ensureFromExchange(ticker: string): Promise<AssetWithQuoteResponse> {
		const normalized = ticker.trim().toUpperCase();
		if (!normalized) {
			throw new BadRequestException('Тикер не указан');
		}

		const existing = await this.prisma.asset.findUnique({
			where: { ticker: normalized },
			include: { quote: true },
		});

		if (existing) {
			return this.mapRowToResponse(existing);
		}

		const results = await this.moexSearch.search(normalized);
		const moexItem = results.find((r) => r.ticker === normalized);
		if (!moexItem) {
			throw new NotFoundException(
				`Бумага с тикером ${normalized} не найдена на бирже`,
			);
		}

		let asset: Asset;
		try {
			asset = await this.prisma.asset.create({
				data: {
					ticker: moexItem.ticker,
					name: moexItem.name,
					type: moexItem.type,
				},
			});
		} catch (e) {
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === 'P2002'
			) {
				const raced = await this.prisma.asset.findUnique({
					where: { ticker: normalized },
					include: { quote: true },
				});
				if (raced) {
					return this.mapRowToResponse(raced);
				}
			}
			throw e;
		}

		const quotes = await this.quoteProvider.getQuotes([asset.ticker]);
		const quoteItem: QuoteProviderItem | undefined = quotes[0];
		if (quoteItem) {
			await this.prisma.quote.upsert({
				where: { assetId: asset.id },
				create: {
					assetId: asset.id,
					price: quoteItem.price,
					currency: quoteItem.currency,
				},
				update: {
					price: quoteItem.price,
					currency: quoteItem.currency,
				},
			});

			return {
				...asset,
				quote: {
					price: quoteItem.price,
					currency: quoteItem.currency,
				},
			};
		}

		return { ...asset };
	}

	private mapRowToResponse(row: AssetWithQuoteRow): AssetWithQuoteResponse {
		return {
			...row,
			quote: row.quote
				? {
						price: Number(row.quote.price),
						currency: row.quote.currency,
					}
				: undefined,
		};
	}
}
