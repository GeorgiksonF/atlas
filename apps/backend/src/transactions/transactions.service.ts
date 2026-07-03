import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

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

export const transctionToResponse = (
	row: Transaction,
): TransactionResponse => ({
	...row,
	price: Number(row.price),
});
@Injectable()
export class TransactionsService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly portfolioAccessService: PortfolioAccessService,
		private readonly assetsService: AssetsService,
	) {}

	async findAllByPortfolioId(
		portfolioId: string,
		userId: string,
	): Promise<TransactionsResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const rows = await this.prisma.transaction.findMany({
			where: { portfolioId },
			orderBy: { date: 'desc' },
		});
		return rows.map(transctionToResponse);
	}

	async findAllByPortfolioIdChronological(
		portfolioId: string,
		userId: string,
	): Promise<TransactionsResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const rows = await this.prisma.transaction.findMany({
			where: { portfolioId },
			orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
		});
		return rows.map(transctionToResponse);
	}

	async findById(
		portfolioId: string,
		transactionId: string,
		userId: string,
	): Promise<TransactionResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const row = await this.prisma.transaction.findFirst({
			where: { id: transactionId, portfolioId },
		});

		if (!row) {
			throw new NotFoundException(
				TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
			);
		}
		return transctionToResponse(row);
	}

	async create(
		portfolioId: string,
		userId: string,
		dto: CreateTransaction,
	): Promise<TransactionResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const isTrade = dto.type === 'BUY' || dto.type === 'SELL';
		const isCash = dto.type === 'DEPOSIT' || dto.type === 'WITHDRAWAL';

		if (isTrade) {
			if (!dto.assetId) {
				throw new BadRequestException(
					TRANSACTION_ERROR_MESSAGES.ASSET_REQUIRED_FOR_TRADE,
				);
			}

			await this.assetsService.findById(dto.assetId);
		}

		if (isCash) {
			if (dto.assetId != null && dto.assetId !== '') {
				throw new BadRequestException(
					TRANSACTION_ERROR_MESSAGES.ASSET_FORBIDDEN_FOR_CASH,
				);
			}
		}

		const quantity = isCash ? 1 : dto.quantity;

		const data = {
			portfolioId,
			assetId: isCash ? null : (dto.assetId ?? null),
			quantity,
			price: dto.price,
			type: dto.type,
			date: new Date(dto.date),
			currency: dto.currency,
		};

		const row = await this.prisma.transaction.create({ data });
		return transctionToResponse(row);
	}

	async update(
		portfolioId: string,
		transactionId: string,
		userId: string,
		dto: UpdateTransaction,
	): Promise<TransactionResponse> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const existing = await this.prisma.transaction.findFirst({
			where: { id: transactionId, portfolioId },
		});

		if (!existing) {
			throw new NotFoundException(
				TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
			);
		}

		const isTrade = (t: string) => t === 'BUY' || t === 'SELL';
		const isCash = (t: string) => t === 'DEPOSIT' || t === 'WITHDRAWAL';
		const type = dto.type ?? existing.type;

		if (dto.assetId !== undefined) {
			if (isTrade(type) && !dto.assetId) {
				throw new BadRequestException(
					TRANSACTION_ERROR_MESSAGES.ASSET_REQUIRED_FOR_TRADE,
				);
			}

			if (isCash(type) && dto.assetId != null && dto.assetId !== '') {
				throw new BadRequestException(
					TRANSACTION_ERROR_MESSAGES.ASSET_FORBIDDEN_FOR_CASH,
				);
			}

			if (isTrade(type) && dto.assetId) {
				await this.assetsService.findById(dto.assetId);
			}
		}

		const data: UpdateTransaction = {
			assetId: dto.assetId ?? undefined,
			quantity: dto.quantity,
			price: dto.price,
			type: dto.type,
			date: dto.date ? new Date(dto.date).toISOString() : undefined,
			currency: dto.currency,
		};

		const row = await this.prisma.transaction.update({
			where: { id: transactionId },
			data,
		});

		return transctionToResponse(row);
	}

	async delete(
		portfolioId: string,
		transactionId: string,
		userId: string,
	): Promise<void> {
		await this.portfolioAccessService.assertOwned(portfolioId, userId);

		const existing = await this.prisma.transaction.findFirst({
			where: { id: transactionId, portfolioId },
		});

		if (!existing) {
			throw new NotFoundException(
				TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
			);
		}

		await this.prisma.transaction.delete({ where: { id: transactionId } });
	}
}
