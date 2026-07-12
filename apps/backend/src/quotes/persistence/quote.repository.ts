import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@atlas/database';
import type { CurrencyType } from '@atlas/types';

export type QuoteUpsertInput = {
	price: number;
	currency: CurrencyType;
};

@Injectable()
export class QuoteRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async upsertForAsset(
		assetId: string,
		input: QuoteUpsertInput,
	): Promise<void> {
		await this.prisma.quote.upsert({
			where: { assetId },
			create: {
				assetId,
				price: input.price,
				currency: input.currency,
			},
			update: {
				price: input.price,
				currency: input.currency,
			},
		});
	}
}
