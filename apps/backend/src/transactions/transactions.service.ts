import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaClient, Transaction } from '@atlas/database';
import type {
	CreateTransaction,
	TransactionResponse,
	TransactionsResponse,
	UpdateTransaction,
} from '@atlas/types';

import { AssetsService } from '../assets/assets.service';
import { PortfolioAccessService } from '../portfolios/access/portfolio-access.service';
import { TRANSACTION_ERROR_MESSAGES } from './constants/messages';
import { transactionToResponse } from './utils/adapters';
import { isTradeType } from './utils/transaction-type.utils';
import {
	assertValidCreatePayload,
	assertValidUpdatePayload,
	normalizeCreatePayload,
	normalizeUpdateData,
} from './utils/transaction-validation.utils';

const CHRONOLOGICAL_ORDER = [
	{ date: 'asc' as const },
	{ createdAt: 'asc' as const },
];

@Injectable()
export class TransactionsService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly portfolioAccessService: PortfolioAccessService,
		private readonly assetsService: AssetsService,
	) {}

	private async findOwnedTransaction(
		portfolioId: string,
		transactionId: string,
	): Promise<Transaction> {
		const row = await this.prisma.transaction.findFirst({
			where: { id: transactionId, portfolioId },
		});

		if (!row) {
			throw new NotFoundException(
				TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
			);
		}

		return row;
	}

	async findAllByPortfolioId(
		portfolioId: string,
		userId: string,
	): Promise<TransactionsResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const rows = await this.prisma.transaction.findMany({
			where: { portfolioId },
			orderBy: { date: 'desc' },
		});
		return rows.map(transactionToResponse);
	}

	async findAllByPortfolioIdChronological(
		portfolioId: string,
		userId: string,
	): Promise<TransactionsResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const rows = await this.prisma.transaction.findMany({
			where: { portfolioId },
			orderBy: CHRONOLOGICAL_ORDER,
		});
		return rows.map(transactionToResponse);
	}

	async findAllChronologicalGroupedByUserPortfolios(
		userId: string,
	): Promise<TransactionResponse[][]> {
		const portfolios = await this.prisma.portfolio.findMany({
			where: { userId },
			orderBy: { createdAt: 'asc' },
			include: {
				transactions: {
					orderBy: CHRONOLOGICAL_ORDER,
				},
			},
		});

		return portfolios.map((portfolio) =>
			portfolio.transactions.map(transactionToResponse),
		);
	}

	async findById(
		portfolioId: string,
		transactionId: string,
		userId: string,
	): Promise<TransactionResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const row = await this.findOwnedTransaction(portfolioId, transactionId);
		return transactionToResponse(row);
	}

	async create(
		portfolioId: string,
		userId: string,
		dto: CreateTransaction,
	): Promise<TransactionResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		assertValidCreatePayload(dto);

		if (isTradeType(dto.type) && dto.assetId) {
			await this.assetsService.findById(dto.assetId);
		}

		const row = await this.prisma.transaction.create({
			data: normalizeCreatePayload(dto, portfolioId),
		});
		return transactionToResponse(row);
	}

	async update(
		portfolioId: string,
		transactionId: string,
		userId: string,
		dto: UpdateTransaction,
	): Promise<TransactionResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const existing = await this.findOwnedTransaction(
			portfolioId,
			transactionId,
		);

		const { effectiveType, effectiveAssetId } = assertValidUpdatePayload(
			dto,
			existing,
		);

		if (isTradeType(effectiveType) && effectiveAssetId) {
			await this.assetsService.findById(effectiveAssetId);
		}

		const row = await this.prisma.transaction.update({
			where: { id: transactionId },
			data: normalizeUpdateData(
				dto,
				existing,
				effectiveType,
				effectiveAssetId,
			),
		});

		return transactionToResponse(row);
	}

	async delete(
		portfolioId: string,
		transactionId: string,
		userId: string,
	): Promise<void> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		await this.findOwnedTransaction(portfolioId, transactionId);

		await this.prisma.transaction.delete({ where: { id: transactionId } });
	}
}
