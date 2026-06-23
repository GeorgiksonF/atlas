import type {
	AssetWithQuoteResponse,
	PortfolioSummaryResponse,
	TransactionResponse,
} from '@atlas/types';

import { amountToRub, roundMoney, rubToUsd, yearsBetween } from './helper';

type PositionState = { quantity: number; basisTransactionCostRub: number };

export type Flow = { date: Date; cashFlow: number };

function mergeFlowsByDay(flows: Flow[]): Flow[] {
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
}

export function computeXirr(flows: Flow[]): number | null {
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

	function calculateNetPresentValue(annualRate: number): number {
		let discountedSum = 0;

		for (const flow of sortedFlowsByDays) {
			const yearsFromStart = yearsBetween(firstCashFlowDate, flow.date);
			discountedSum +=
				flow.cashFlow / Math.pow(1 + annualRate, yearsFromStart);
		}

		return discountedSum;
	}

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
}

export function emptyPortfolioSummary(): PortfolioSummaryResponse {
	return {
		totalValue: 0,
		marketValue: 0,
		cashBalance: 0,
		profit: 0,
		profitPercentOfNetInvested: null,
		annualizedReturnPercent: null,
		dayChangeAmount: 0,
		dayChangePercent: null,
		primaryCurrency: 'RUB',
		alternativeCurrency: 'USD',
		alternativeTotalValue: 0,
	};
}

// const applyTransactionsToLedger = (transactions: SummaryTransaction[]) => {};

export function computePortfolioSummary(
	transactions: TransactionResponse[],
	assets: AssetWithQuoteResponse[],
): PortfolioSummaryResponse {
	if (!transactions.length) {
		return emptyPortfolioSummary();
	}

	let cashBalance = 0;
	let realizedPnLRub = 0;
	const positions = new Map<string, PositionState>();
	let netDepositsRub = 0;
	const investorFlows: Flow[] = [];

	for (const tx of transactions) {
		const priceRub = amountToRub(tx.price, tx.currency);

		if (tx.type === 'DEPOSIT') {
			cashBalance += priceRub;
			netDepositsRub += priceRub;
			investorFlows.push({ date: tx.date, cashFlow: -priceRub });
			continue;
		}
		if (tx.type === 'WITHDRAWAL') {
			cashBalance -= priceRub;
			netDepositsRub -= priceRub;
			investorFlows.push({ date: tx.date, cashFlow: priceRub });
			continue;
		}

		if (!tx.assetId) {
			continue;
		}

		const position = positions.get(tx.assetId) ?? {
			quantity: 0,
			basisTransactionCostRub: 0,
		};

		if (tx.type === 'BUY') {
			const transactionCostRub = amountToRub(
				tx.price * tx.quantity,
				tx.currency,
			);
			cashBalance -= transactionCostRub;
			const newQuantity = position.quantity + tx.quantity;
			const newTransactionCost =
				position.basisTransactionCostRub + transactionCostRub;
			positions.set(tx.assetId, {
				quantity: newQuantity,
				basisTransactionCostRub: newTransactionCost,
			});
			continue;
		}

		if (tx.type === 'SELL') {
			const saleProceedsRub = amountToRub(
				tx.price * tx.quantity,
				tx.currency,
			);
			cashBalance += saleProceedsRub;
			const avgCostPerUnitRub =
				position.basisTransactionCostRub / position.quantity;
			const soldPositionCostRub = avgCostPerUnitRub * tx.quantity;
			realizedPnLRub += saleProceedsRub - soldPositionCostRub;
			const newQuantity = position.quantity - tx.quantity;
			const newBasisTransactionCost =
				position.basisTransactionCostRub - soldPositionCostRub;
			positions.set(tx.assetId, {
				quantity: newQuantity,
				basisTransactionCostRub: newBasisTransactionCost,
			});
		}
	}

	let openPositionsMarketValueRub = 0;
	let openPositionsCostBasisRub = 0;
	for (const [assetId, position] of positions) {
		openPositionsCostBasisRub += position.basisTransactionCostRub;
		const asset = assets.find((ast) => ast.id === assetId);
		const assetQuote = asset?.quote
			? amountToRub(asset.quote.price, asset.quote.currency)
			: 1;

		openPositionsMarketValueRub += position.quantity * assetQuote;
	}

	const unrealizedPnLRub =
		openPositionsMarketValueRub - openPositionsCostBasisRub;
	const totalProfitRub = realizedPnLRub + unrealizedPnLRub;
	const totalValueRub = cashBalance + openPositionsMarketValueRub;

	investorFlows.push({ date: new Date(), cashFlow: totalValueRub });
	const xirr = computeXirr(investorFlows);
	const annualizedReturnPercent =
		xirr !== null && Number.isFinite(xirr) ? xirr * 100 : null;

	const profitPercentOfNetInvested =
		netDepositsRub > 1e-6 ? (totalProfitRub / netDepositsRub) * 100 : null;

	return {
		totalValue: roundMoney(totalValueRub),
		marketValue: roundMoney(openPositionsMarketValueRub),
		cashBalance: roundMoney(cashBalance),
		profit: roundMoney(totalProfitRub),
		profitPercentOfNetInvested:
			profitPercentOfNetInvested !== null
				? roundMoney(profitPercentOfNetInvested)
				: null,
		annualizedReturnPercent:
			annualizedReturnPercent !== null
				? roundMoney(annualizedReturnPercent)
				: null,
		dayChangeAmount: 0,
		dayChangePercent: null,
		primaryCurrency: 'RUB',
		alternativeCurrency: 'USD',
		alternativeTotalValue: roundMoney(rubToUsd(totalValueRub)),
	};
}

export function sumPortfoliosSummaries(
	summaries: PortfolioSummaryResponse[],
): Pick<
	PortfolioSummaryResponse,
	'totalValue' | 'marketValue' | 'cashBalance' | 'profit' | 'dayChangeAmount'
> {
	return summaries.reduce(
		(acc, s) => ({
			totalValue: acc.totalValue + s.totalValue,
			marketValue: acc.marketValue + s.marketValue,
			cashBalance: acc.cashBalance + s.cashBalance,
			profit: acc.profit + s.profit,
			dayChangeAmount: acc.dayChangeAmount + s.dayChangeAmount,
		}),
		{
			totalValue: 0,
			marketValue: 0,
			cashBalance: 0,
			profit: 0,
			dayChangeAmount: 0,
		},
	);
}
