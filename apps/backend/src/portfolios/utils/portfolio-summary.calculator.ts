import type {
	AssetWithQuoteResponse,
	PortfolioSummaryResponse,
	TransactionResponse,
} from '@atlas/types';

import {
	amountToRub,
	type FxConversionContext,
	roundMoney,
	rubToUsd,
} from './helper';
import { mergeTransactionsChronologically } from './summary-data.utils';
import { computeXirr, type Flow } from './xirr';

export { createFxConversionContext, type FxConversionContext } from './helper';
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

	fx: FxConversionContext,
): boolean => {
	const priceRub = amountToRub(tx.price, tx.currency, fx, tx.date);

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

	dayChangeAmount: number;

	dayChangePercent: number | null;
};

export const toPortfolioSummaryResponse = (
	numbers: PortfolioSummary,

	fx: FxConversionContext,
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

		dayChangeAmount: roundMoney(numbers.dayChangeAmount),

		dayChangePercent:
			numbers.dayChangePercent !== null
				? roundMoney(numbers.dayChangePercent)
				: null,

		primaryCurrency: 'RUB',

		alternativeCurrency: 'USD',

		alternativeTotalValue: roundMoney(rubToUsd(numbers.totalValue, fx)),
	};
};

export const emptyPortfolioSummary = (
	fx: FxConversionContext,
): PortfolioSummaryResponse =>
	toPortfolioSummaryResponse(
		{
			totalValue: 0,

			marketValue: 0,

			cashBalance: 0,

			profit: 0,

			profitPercentOfNetInvested: null,

			annualizedReturnPercent: null,

			dayChangeAmount: 0,

			dayChangePercent: null,
		},

		fx,
	);

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

export type PortfolioMetrics = {
	totalValue: number;

	marketValue: number;

	cashBalance: number;

	profit: number;

	netDepositsRub: number;

	investorFlows: Flow[];
};

export const filterTransactionsUpTo = (
	transactions: TransactionResponse[],

	cutoff: Date,
): TransactionResponse[] =>
	transactions.filter((tx) => tx.date.getTime() <= cutoff.getTime());

export const computeDayChange = (
	todayMarketValue: number,

	yesterdayMarketValue: number | null,
): Pick<PortfolioSummary, 'dayChangeAmount' | 'dayChangePercent'> => {
	if (yesterdayMarketValue === null) {
		return { dayChangeAmount: 0, dayChangePercent: null };
	}

	const dayChangeAmount = todayMarketValue - yesterdayMarketValue;

	const dayChangePercent =
		yesterdayMarketValue > NET_DEPOSITS_EPSILON
			? (dayChangeAmount / yesterdayMarketValue) * 100
			: null;

	return { dayChangeAmount, dayChangePercent };
};

/**

 * Транзакции должны быть отсортированы по `date asc`, при равной дате — по `createdAt asc`.

 * Функция не пересортировывает входной массив.

 */

export const computePortfolioMetrics = (
	transactions: TransactionResponse[],

	assets: AssetWithQuoteResponse[],

	fx: FxConversionContext,
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
		if (applyDepositOrWithdrawal(tx, acc, fx)) {
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

				fx,

				tx.date,
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

				fx,

				tx.date,
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
			? amountToRub(asset.quote.price, asset.quote.currency, fx)
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

export type PortfolioSummaryInput = {
	transactions: TransactionResponse[];

	assets: AssetWithQuoteResponse[];

	fx: FxConversionContext;

	yesterdayAssets?: AssetWithQuoteResponse[];

	hasYesterdayQuoteData?: boolean;

	yesterdayCutoff?: Date;
};

export const computePortfolioSummaryFromInput = ({
	transactions,

	assets,

	fx,

	yesterdayAssets,

	hasYesterdayQuoteData = false,

	yesterdayCutoff,
}: PortfolioSummaryInput): PortfolioSummaryResponse => {
	if (!transactions.length) {
		return emptyPortfolioSummary(fx);
	}

	const metrics = computePortfolioMetrics(transactions, assets, fx);

	const returnMetrics = computeReturnMetrics({
		netDepositsRub: metrics.netDepositsRub,

		profitRub: metrics.profit,

		investorFlows: metrics.investorFlows,

		terminalValue: metrics.totalValue,
	});

	let dayChange = {
		dayChangeAmount: 0,
		dayChangePercent: null as number | null,
	};

	if (
		hasYesterdayQuoteData &&
		yesterdayAssets &&
		yesterdayCutoff !== undefined
	) {
		const yesterdayTransactions = filterTransactionsUpTo(
			transactions,

			yesterdayCutoff,
		);

		const yesterdayMetrics = computePortfolioMetrics(
			yesterdayTransactions,

			yesterdayAssets,

			fx,
		);

		dayChange = computeDayChange(
			metrics.marketValue,

			yesterdayMetrics.marketValue,
		);
	}

	return toPortfolioSummaryResponse(
		{
			totalValue: metrics.totalValue,

			marketValue: metrics.marketValue,

			cashBalance: metrics.cashBalance,

			profit: metrics.profit,

			...returnMetrics,

			...dayChange,
		},

		fx,
	);
};

export const computePortfolioSummary = (
	transactions: TransactionResponse[],

	assets: AssetWithQuoteResponse[],

	fx: FxConversionContext,

	options?: Omit<PortfolioSummaryInput, 'transactions' | 'assets' | 'fx'>,
): PortfolioSummaryResponse =>
	computePortfolioSummaryFromInput({
		transactions,

		assets,

		fx,

		...options,
	});

/**

 * Aggregated summary treats all user portfolios as one virtual portfolio:

 * transactions are merged chronologically and metrics are computed once.

 */

export const computeAggregatedPortfolioSummary = (
	transactionsByPortfolio: TransactionResponse[][],

	assets: AssetWithQuoteResponse[],

	fx: FxConversionContext,

	options?: Omit<PortfolioSummaryInput, 'transactions' | 'assets' | 'fx'>,
): PortfolioSummaryResponse => {
	if (transactionsByPortfolio.length === 0) {
		return emptyPortfolioSummary(fx);
	}

	const mergedTransactions = mergeTransactionsChronologically(
		transactionsByPortfolio,
	);

	return computePortfolioSummary(mergedTransactions, assets, fx, options);
};
