import type {
	AssetWithQuoteResponse,
	PortfolioSummaryResponse,
	TransactionResponse,
} from '@atlas/types';

import { amountToRub, roundMoney, rubToUsd } from './helper';
import { computeXirr, type Flow } from './xirr';

export type { Flow } from './xirr';
export { computeXirr } from './xirr';

type PositionState = { quantity: number; basisTransactionCostRub: number };

type DepositWithdrawalAccumulator = {
	investorFlows: Flow[];
	netDepositsRub: number;
	cashBalance?: number;
};

export const applyDepositOrWithdrawal = (
	tx: TransactionResponse,
	acc: DepositWithdrawalAccumulator,
): boolean => {
	const priceRub = amountToRub(tx.price, tx.currency);

	if (tx.type === 'DEPOSIT') {
		acc.netDepositsRub += priceRub;
		acc.investorFlows.push({
			date: tx.date,
			cashFlow: -priceRub,
		});
		if (acc.cashBalance !== undefined) acc.cashBalance += priceRub;
		return true;
	} else if (tx.type === 'WITHDRAWAL') {
		acc.netDepositsRub -= priceRub;
		acc.investorFlows.push({
			date: tx.date,
			cashFlow: priceRub,
		});
		if (acc.cashBalance !== undefined) acc.cashBalance -= priceRub;
		return true;
	}

	return false;
};

type PortfolioSummary = {
	totalValue: number;
	marketValue: number;
	cashBalance: number;
	profit: number;
	profitPercentOfNetInvested: number | null;
	annualizedReturnPercent: number | null;
};

export const toPortfolioSummaryResponse = (
	numbers: PortfolioSummary,
): PortfolioSummaryResponse => {
	return {
		totalValue: roundMoney(numbers.totalValue),
		marketValue: roundMoney(numbers.marketValue),
		cashBalance: roundMoney(numbers.cashBalance),
		profit: roundMoney(numbers.profit),
		profitPercentOfNetInvested:
			numbers.profitPercentOfNetInvested !== null
				? roundMoney(numbers.profitPercentOfNetInvested)
				: null,
		annualizedReturnPercent:
			numbers.annualizedReturnPercent !== null
				? roundMoney(numbers.annualizedReturnPercent)
				: null,
		dayChangeAmount: 0,
		dayChangePercent: null,
		primaryCurrency: 'RUB',
		alternativeCurrency: 'USD',
		alternativeTotalValue: roundMoney(rubToUsd(numbers.totalValue)),
	};
};

export const emptyPortfolioSummary = (): PortfolioSummaryResponse =>
	toPortfolioSummaryResponse({
		totalValue: 0,
		marketValue: 0,
		cashBalance: 0,
		profit: 0,
		profitPercentOfNetInvested: null,
		annualizedReturnPercent: null,
	});

type ReturnMetricsInput = {
	netDepositsRub: number;
	profitRub: number;
	investorFlows: Flow[];
	terminalValue: number;
};

type ReturnMetrics = {
	profitPercentOfNetInvested: number | null;
	annualizedReturnPercent: number | null;
};

const NET_DEPOSITS_EPSILON = 1e-6;

export const computeReturnMetrics = ({
	netDepositsRub,
	profitRub,
	investorFlows,
	terminalValue,
}: ReturnMetricsInput): ReturnMetrics => {
	const flowsForXirr: Flow[] = [
		...investorFlows,
		{ date: new Date(), cashFlow: terminalValue },
	];

	const xirr = computeXirr(flowsForXirr);

	const annualizedReturnPercent =
		xirr !== null && Number.isFinite(xirr) ? xirr * 100 : null;

	const profitPercentOfNetInvested =
		netDepositsRub > NET_DEPOSITS_EPSILON
			? (profitRub / netDepositsRub) * 100
			: null;

	return { profitPercentOfNetInvested, annualizedReturnPercent };
};

type PortfolioMetrics = {
	totalValue: number;
	marketValue: number;
	cashBalance: number;
	profit: number;
	netDepositsRub: number;
	investorFlows: Flow[];
};

/**
 * Транзакции должны быть отсортированы по `date asc`, при равной дате — по `createdAt asc`.
 * Функция не пересортировывает входной массив.
 */
export const computePortfolioMetrics = (
	transactions: TransactionResponse[],
	assets: AssetWithQuoteResponse[],
): PortfolioMetrics => {
	if (!transactions.length) {
		return {
			totalValue: 0,
			marketValue: 0,
			cashBalance: 0,
			profit: 0,
			netDepositsRub: 0,
			investorFlows: [],
		};
	}

	let realizedPnLRub = 0;
	const positions = new Map<string, PositionState>();
	const acc = {
		netDepositsRub: 0,
		investorFlows: [] as Flow[],
		cashBalance: 0,
	};

	for (const tx of transactions) {
		if (applyDepositOrWithdrawal(tx, acc)) {
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
			acc.cashBalance -= transactionCostRub;
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
			acc.cashBalance += saleProceedsRub;
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

	const assetsById = new Map(assets.map((asset) => [asset.id, asset]));

	let openPositionsMarketValueRub = 0;
	let openPositionsCostBasisRub = 0;
	for (const [assetId, position] of positions) {
		openPositionsCostBasisRub += position.basisTransactionCostRub;
		const asset = assetsById.get(assetId);
		const assetQuote = asset?.quote
			? amountToRub(asset.quote.price, asset.quote.currency)
			: 1;

		openPositionsMarketValueRub += position.quantity * assetQuote;
	}

	const unrealizedPnLRub =
		openPositionsMarketValueRub - openPositionsCostBasisRub;
	const totalProfitRub = realizedPnLRub + unrealizedPnLRub;
	const totalValueRub = acc.cashBalance + openPositionsMarketValueRub;

	return {
		totalValue: totalValueRub,
		marketValue: openPositionsMarketValueRub,
		cashBalance: acc.cashBalance,
		profit: totalProfitRub,
		netDepositsRub: acc.netDepositsRub,
		investorFlows: acc.investorFlows,
	};
};

export const computePortfolioSummary = (
	transactions: TransactionResponse[],
	assets: AssetWithQuoteResponse[],
): PortfolioSummaryResponse => {
	if (!transactions.length) {
		return emptyPortfolioSummary();
	}

	const metrics = computePortfolioMetrics(transactions, assets);

	const returnMetrics = computeReturnMetrics({
		netDepositsRub: metrics.netDepositsRub,
		profitRub: metrics.profit,
		investorFlows: metrics.investorFlows,
		terminalValue: metrics.totalValue,
	});

	return toPortfolioSummaryResponse({
		totalValue: metrics.totalValue,
		marketValue: metrics.marketValue,
		cashBalance: metrics.cashBalance,
		profit: metrics.profit,
		...returnMetrics,
	});
};

export const sumPortfolioMetrics = (
	metrics: PortfolioMetrics[],
): Pick<
	PortfolioMetrics,
	'totalValue' | 'marketValue' | 'cashBalance' | 'profit'
> => {
	return metrics.reduce(
		(acc, m) => ({
			totalValue: acc.totalValue + m.totalValue,
			marketValue: acc.marketValue + m.marketValue,
			cashBalance: acc.cashBalance + m.cashBalance,
			profit: acc.profit + m.profit,
		}),
		{
			totalValue: 0,
			marketValue: 0,
			cashBalance: 0,
			profit: 0,
		},
	);
};

export const computeAggregatedPortfolioSummary = (
	transactionsByPortfolio: TransactionResponse[][],
	assets: AssetWithQuoteResponse[],
): PortfolioSummaryResponse => {
	if (transactionsByPortfolio.length === 0) {
		return emptyPortfolioSummary();
	}

	const metricsList = transactionsByPortfolio.map((transactions) =>
		computePortfolioMetrics(transactions, assets),
	);

	const sums = sumPortfolioMetrics(metricsList);

	const netDepositsRub = metricsList.reduce(
		(total, m) => total + m.netDepositsRub,
		0,
	);
	const investorFlows = metricsList.flatMap((m) => m.investorFlows);

	const returnMetrics = computeReturnMetrics({
		netDepositsRub,
		profitRub: sums.profit,
		investorFlows,
		terminalValue: sums.totalValue,
	});

	return toPortfolioSummaryResponse({
		totalValue: sums.totalValue,
		marketValue: sums.marketValue,
		cashBalance: sums.cashBalance,
		profit: sums.profit,
		...returnMetrics,
	});
};
