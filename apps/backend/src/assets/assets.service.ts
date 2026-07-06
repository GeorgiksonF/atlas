import { Injectable, NotFoundException } from '@nestjs/common';

import { Prisma, PrismaClient } from '@atlas/database';
import type {
	AssetResponse,
	AssetSearchItem,
	AssetsResponse,
	AssetWithQuoteResponse,
} from '@atlas/types';

import { ASSET_ERROR_MESSAGES } from './constants/messages';
import { assetWithQuotesToResponse } from './utils/adapters';

@Injectable()
export class AssetsService {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(): Promise<AssetsResponse> {
		return this.prisma.asset.findMany({
			orderBy: { ticker: 'asc' },
		});
	}

	async findById(id: string): Promise<AssetResponse> {
		const asset = await this.prisma.asset.findUnique({
			where: { id },
		});
		if (!asset) {
			throw new NotFoundException(ASSET_ERROR_MESSAGES.ASSET_NOT_FOUND);
		}
		return asset;
	}

	async findByIdsWithQuotes(
		ids: string[],
	): Promise<AssetWithQuoteResponse[]> {
		if (!ids.length) return [];

		const response = await this.prisma.asset.findMany({
			where: {
				id: {
					in: ids,
				},
			},
			include: { quote: true },
		});

		if (!response.length) {
			return [];
		}

		return response.map(assetWithQuotesToResponse);
	}

	async findAllWithQuotes(): Promise<AssetWithQuoteResponse[]> {
		const response = await this.prisma.asset.findMany({
			include: { quote: true },
		});

		if (!response.length) {
			return [];
		}

		return response.map(assetWithQuotesToResponse);
	}

	async findByTicker(ticker: string): Promise<AssetResponse | null> {
		return this.prisma.asset.findUnique({
			where: { ticker: ticker.toUpperCase() },
		});
	}

	async findByTickerWithQuote(
		ticker: string,
	): Promise<AssetWithQuoteResponse | null> {
		const asset = await this.prisma.asset.findUnique({
			where: { ticker: ticker.toUpperCase() },
			include: { quote: true },
		});

		if (!asset) {
			return null;
		}

		return assetWithQuotesToResponse(asset);
	}

	async createFromExchangeItem(
		item: AssetSearchItem,
	): Promise<AssetResponse> {
		try {
			return await this.prisma.asset.create({
				data: {
					ticker: item.ticker,
					name: item.name,
					type: item.type,
				},
			});
		} catch (e) {
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === 'P2002'
			) {
				const existing = await this.findByTicker(item.ticker);
				if (existing) {
					return existing;
				}
			}
			throw e;
		}
	}
}
