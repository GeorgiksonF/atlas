import { yearsBetween } from './helper';

export type Flow = { date: Date; cashFlow: number };

const mergeFlowsByDay = (flows: Flow[]): Flow[] => {
	const cashFlowsByDay = new Map<string, Flow>();
	for (const flow of flows) {
		const dateKey = flow.date.toISOString().slice(0, 10);
		const existingFlow = cashFlowsByDay.get(dateKey);
		if (existingFlow) {
			existingFlow.cashFlow += flow.cashFlow;
		} else {
			cashFlowsByDay.set(dateKey, {
				date: new Date(flow.date),
				cashFlow: flow.cashFlow,
			});
		}
	}
	return [...cashFlowsByDay.values()].sort(
		(a, b) => a.date.getTime() - b.date.getTime(),
	);
};

export const computeXirr = (flows: Flow[]): number | null => {
	if (flows.length < 2) {
		return null;
	}

	const sortedFlowsByDays = mergeFlowsByDay(flows);

	const firstCashFlowDate = sortedFlowsByDays[0].date;

	let hasPositiveFlow = false;
	let hasNegativeFlow = false;

	for (const flow of sortedFlowsByDays) {
		if (flow.cashFlow > 0) {
			hasPositiveFlow = true;
		}
		if (flow.cashFlow < 0) {
			hasNegativeFlow = true;
		}
	}

	if (!hasPositiveFlow || !hasNegativeFlow) {
		return null;
	}

	const calculateNetPresentValue = (annualRate: number): number => {
		let discountedSum = 0;

		for (const flow of sortedFlowsByDays) {
			const yearsFromStart = yearsBetween(firstCashFlowDate, flow.date);
			discountedSum +=
				flow.cashFlow / Math.pow(1 + annualRate, yearsFromStart);
		}

		return discountedSum;
	};

	let rateLowerBound = -0.999999;
	let rateUpperBound = 100;
	let npvAtLowerBound = calculateNetPresentValue(rateLowerBound);
	let npvAtUpperBound = calculateNetPresentValue(rateUpperBound);
	let widenAttempts = 0;

	while (npvAtLowerBound * npvAtUpperBound > 0 && widenAttempts < 25) {
		rateUpperBound *= 2;
		npvAtUpperBound = calculateNetPresentValue(rateUpperBound);
		widenAttempts++;
	}

	if (npvAtLowerBound * npvAtUpperBound > 0) {
		return null;
	}

	const maxBinarySearchIterations = 200;
	const npvTolerance = 1e-7;

	for (let i = 0; i < maxBinarySearchIterations; i++) {
		const midpointRate = (rateLowerBound + rateUpperBound) / 2;
		const npvAtMidpoint = calculateNetPresentValue(midpointRate);
		if (Math.abs(npvAtMidpoint) < npvTolerance) {
			return midpointRate;
		}
		if (npvAtLowerBound * npvAtMidpoint <= 0) {
			rateUpperBound = midpointRate;
			npvAtUpperBound = npvAtMidpoint;
		} else {
			rateLowerBound = midpointRate;
			npvAtLowerBound = npvAtMidpoint;
		}
	}

	return (rateLowerBound + rateUpperBound) / 2;
};
