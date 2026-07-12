import { d } from '@test/fixtures/portfolio-summary.fixtures';

import { computeXirr, type Flow } from '@/portfolios/utils/xirr';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

const oneYearLater = (start: Date): Date =>
	new Date(start.getTime() + MS_PER_YEAR);

describe('computeXirr', () => {
	it('возвращает null, если денежных потоков меньше двух', () => {
		expect(computeXirr([])).toBeNull();
		expect(
			computeXirr([{ date: d('2024-01-01'), cashFlow: -1000 }]),
		).toBeNull();
	});

	it('возвращает null, если все потоки одного знака', () => {
		const onlyOutflows: Flow[] = [
			{ date: d('2024-01-01'), cashFlow: -1000 },
			{ date: d('2024-06-01'), cashFlow: -500 },
		];
		const onlyInflows: Flow[] = [
			{ date: d('2024-01-01'), cashFlow: 1000 },
			{ date: d('2024-06-01'), cashFlow: 500 },
		];

		expect(computeXirr(onlyOutflows)).toBeNull();
		expect(computeXirr(onlyInflows)).toBeNull();
	});

	it('считает ~10% годовых при вложении на один год с доходностью 10%', () => {
		const investedAt = d('2024-06-01');
		const flows: Flow[] = [
			{ date: investedAt, cashFlow: -100_000 },
			{ date: oneYearLater(investedAt), cashFlow: 110_000 },
		];

		const xirr = computeXirr(flows);

		expect(xirr).not.toBeNull();
		expect(xirr!).toBeCloseTo(0.1, 3);
	});

	it('объединяет несколько потоков в один день', () => {
		const investedAt = d('2024-06-01T09:00:00.000Z');
		const returnedAt = oneYearLater(investedAt);
		const singleFlow: Flow[] = [
			{ date: investedAt, cashFlow: -100_000 },
			{ date: returnedAt, cashFlow: 110_000 },
		];
		const splitSameDay: Flow[] = [
			{ date: investedAt, cashFlow: -50_000 },
			{ date: investedAt, cashFlow: -50_000 },
			{ date: returnedAt, cashFlow: 110_000 },
		];

		expect(computeXirr(splitSameDay)).toBeCloseTo(
			computeXirr(singleFlow)!,
			6,
		);
	});
});
