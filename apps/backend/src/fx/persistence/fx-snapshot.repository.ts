import { Injectable } from '@nestjs/common';

import { PrismaClient } from '@atlas/database';

@Injectable()
export class FxSnapshotRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async upsertDaily(usdToRub: number, snapshotDate: Date): Promise<void> {
		await this.prisma.fxSnapshot.upsert({
			where: { snapshotDate },
			create: { usdToRub, snapshotDate },
			update: { usdToRub },
		});
	}

	async findRatesOnOrBeforeDates(
		calendarDates: string[],
	): Promise<Map<string, number>> {
		if (calendarDates.length === 0) return new Map();

		const uniqueDates = [...new Set(calendarDates)].sort();
		const earliest = uniqueDates[0];
		const snapshots = await this.prisma.fxSnapshot.findMany({
			where: {
				snapshotDate: { gte: new Date(`${earliest}T00:00:00.000Z`) },
			},
			orderBy: { snapshotDate: 'asc' },
		});

		const ratesByDate = new Map<string, number>();
		for (const snap of snapshots) {
			const key = snap.snapshotDate.toISOString().slice(0, 10);
			ratesByDate.set(key, Number(snap.usdToRub));
		}

		const result = new Map<string, number>();
		let lastKnown: number | undefined;

		for (const targetDate of uniqueDates) {
			if (ratesByDate.has(targetDate)) {
				lastKnown = ratesByDate.get(targetDate);
			}
			if (lastKnown !== undefined) {
				result.set(targetDate, lastKnown);
			}
		}

		return result;
	}

	async findLatest(): Promise<number | null> {
		const snapshot = await this.prisma.fxSnapshot.findFirst({
			orderBy: { snapshotDate: 'desc' },
		});
		return snapshot ? Number(snapshot.usdToRub) : null;
	}

	async findByCalendarDate(calendarDate: string): Promise<number | null> {
		const snapshot = await this.prisma.fxSnapshot.findUnique({
			where: { snapshotDate: new Date(`${calendarDate}T00:00:00.000Z`) },
		});
		return snapshot ? Number(snapshot.usdToRub) : null;
	}
}
