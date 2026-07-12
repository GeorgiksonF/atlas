import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@atlas/database';
import type { AssetWithQuoteResponse, CurrencyType } from '@atlas/types';

export type QuoteSnapshotInput = {
	assetId: string;
	price: number;
	currency: CurrencyType;
	snapshotDate: Date;
};

@Injectable()
export class QuoteSnapshotRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async upsertDaily(input: QuoteSnapshotInput): Promise<void> {
		await this.prisma.quoteSnapshot.upsert({
			where: {
				assetId_snapshotDate: {
					assetId: input.assetId,
					snapshotDate: input.snapshotDate,
				},
			},
			create: {
				assetId: input.assetId,
				price: input.price,
				currency: input.currency,
				snapshotDate: input.snapshotDate,
			},
			update: {
				price: input.price,
				currency: input.currency,
			},
		});
	}

	async findByAssetIdsAndCalendarDate(
		assetIds: string[],
		calendarDate: string,
	): Promise<Map<string, { price: number; currency: CurrencyType }>> {
		if (assetIds.length === 0) return new Map();

		const snapshotDate = new Date(`${calendarDate}T00:00:00.000Z`);
		const rows = await this.prisma.quoteSnapshot.findMany({
			where: {
				assetId: { in: assetIds },
				snapshotDate,
			},
		});

		return new Map(
			rows.map((row) => [
				row.assetId,
				{ price: Number(row.price), currency: row.currency },
			]),
		);
	}

	hasSnapshotsForAssetIds(
		assetIds: string[],
		calendarDate: string,
	): Promise<boolean> {
		if (assetIds.length === 0) return Promise.resolve(false);

		const snapshotDate = new Date(`${calendarDate}T00:00:00.000Z`);
		return this.prisma.quoteSnapshot
			.count({
				where: {
					assetId: { in: assetIds },
					snapshotDate,
				},
			})
			.then((count) => count > 0);
	}
}

export const applySnapshotQuotesToAssets = (
	assets: AssetWithQuoteResponse[],
	snapshots: Map<string, { price: number; currency: CurrencyType }>,
): AssetWithQuoteResponse[] =>
	assets.map((asset) => {
		const snapshot = snapshots.get(asset.id);
		if (!snapshot) return asset;

		return {
			...asset,
			quote: {
				price: snapshot.price,
				currency: snapshot.currency,
			},
		};
	});
