import { Inject, Injectable } from '@nestjs/common';

import type { TransactionResponse } from '@atlas/types';

import {
	createFxConversionContext,
	type FxConversionContext,
} from '../portfolios/utils/helper';
import { toMoscowCalendarDate } from '../portfolios/utils/moscow-date.utils';
import {
	FX_RATE_PROVIDER,
	type IFxRateProvider,
} from './contract/fx-rate-provider.interface';
import { FxSnapshotRepository } from './persistence/fx-snapshot.repository';

const CACHE_TTL_MS = 10 * 60 * 1000;
const FALLBACK_USD_TO_RUB = 90;

@Injectable()
export class FxRateService {
	private cachedRate: number | null = null;
	private cacheExpiresAt = 0;

	constructor(
		@Inject(FX_RATE_PROVIDER)
		private readonly fxRateProvider: IFxRateProvider,
		private readonly fxSnapshotRepository: FxSnapshotRepository,
	) {}

	async getCurrentUsdToRub(): Promise<number> {
		const now = Date.now();
		if (this.cachedRate !== null && now < this.cacheExpiresAt) {
			return this.cachedRate;
		}

		const liveRate = await this.fxRateProvider.getUsdToRub();
		if (liveRate !== null) {
			this.cachedRate = liveRate;
			this.cacheExpiresAt = now + CACHE_TTL_MS;
			return liveRate;
		}

		const latestSnapshot = await this.fxSnapshotRepository.findLatest();
		if (latestSnapshot !== null) {
			this.cachedRate = latestSnapshot;
			this.cacheExpiresAt = now + CACHE_TTL_MS;
			return latestSnapshot;
		}

		return FALLBACK_USD_TO_RUB;
	}

	async buildConversionContext(
		transactions: TransactionResponse[] = [],
	): Promise<FxConversionContext> {
		const currentUsdToRub = await this.getCurrentUsdToRub();
		const usdTransactionDates = transactions
			.filter((tx) => tx.currency === 'USD')
			.map((tx) => toMoscowCalendarDate(tx.date));

		const historicalRates =
			await this.fxSnapshotRepository.findRatesOnOrBeforeDates(
				usdTransactionDates,
			);

		return createFxConversionContext(currentUsdToRub, historicalRates);
	}

	async snapshotCurrentRate(
		snapshotDate: Date,
		usdToRub: number,
	): Promise<void> {
		await this.fxSnapshotRepository.upsertDaily(usdToRub, snapshotDate);
	}
}
