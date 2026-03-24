import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@atlas/database';
import type {
	CreateTransaction,
	TransactionResponse,
	TransactionsResponse,
	UpdateTransaction,
} from '@atlas/types';
import { TRANSACTION_ERROR_MESSAGES } from './constants/messages';
import { PortfoliosService } from '../portfolios/portfolios.service';
import { AssetsService } from '../assets/assets.service';

function toResponse(row: {
	id: string;
	quantity: number;
	price: unknown;
	type: string;
	date: Date;
	currency: string;
	createdAt: Date;
	portfolioId: string;
	assetId: string | null;
}): TransactionResponse {
	return {
		id: row.id,
		quantity: row.quantity,
		price: Number(row.price),
		type: row.type as TransactionResponse['type'],
		date: row.date,
		currency: row.currency as TransactionResponse['currency'],
		createdAt: row.createdAt,
		portfolioId: row.portfolioId,
		assetId: row.assetId,
	};
}

@Injectable()
export class TransactionsService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly portfoliosService: PortfoliosService,
		private readonly assetsService: AssetsService,
	) {}

	private async ensurePortfolioAccess(
		portfolioId: string,
		userId: string,
	): Promise<void> {
		if (!userId) {
			throw new BadRequestException(
				TRANSACTION_ERROR_MESSAGES.USER_ID_REQUIRED,
			);
		}
		await this.portfoliosService.findById(portfolioId, userId);
	}

	async findAllByPortfolioId(
		portfolioId: string,
		userId: string,
	): Promise<TransactionsResponse> {
		await this.ensurePortfolioAccess(portfolioId, userId);
		const rows = await this.prisma.transactions.findMany({
			where: { portfolioId },
			orderBy: { date: 'desc' },
		});
		return rows.map(toResponse);
	}

	async findById(
		portfolioId: string,
		transactionId: string,
		userId: string,
	): Promise<TransactionResponse> {
		await this.ensurePortfolioAccess(portfolioId, userId);
		const row = await this.prisma.transactions.findFirst({
			where: { id: transactionId, portfolioId },
		});
		if (!row) {
			throw new NotFoundException(
				TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
			);
		}
		return toResponse(row);
	}

	async create(
		portfolioId: string,
		userId: string,
		dto: CreateTransaction,
	): Promise<TransactionResponse> {
		await this.ensurePortfolioAccess(portfolioId, userId);

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
		const data: Prisma.TransactionsUncheckedCreateInput = {
			portfolioId,
			assetId: isCash ? null : (dto.assetId ?? null),
			quantity,
			price: dto.price,
			type: dto.type as Prisma.TransactionsUncheckedCreateInput['type'],
			date: new Date(dto.date),
			currency: dto.currency,
		};

		const row = await this.prisma.transactions.create({ data });
		return toResponse(row);
	}

	async update(
		portfolioId: string,
		transactionId: string,
		userId: string,
		dto: UpdateTransaction,
	): Promise<TransactionResponse> {
		await this.ensurePortfolioAccess(portfolioId, userId);
		const existing = await this.prisma.transactions.findFirst({
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

		const data: Prisma.TransactionsUncheckedUpdateInput = {};
		if (dto.assetId !== undefined)
			data.assetId = isCash(type) ? null : (dto.assetId ?? null);
		if (dto.quantity !== undefined)
			data.quantity = isCash(type) ? 1 : dto.quantity;
		if (dto.price !== undefined) data.price = dto.price;
		if (dto.type !== undefined)
			data.type =
				dto.type as Prisma.TransactionsUncheckedUpdateInput['type'];
		if (dto.date !== undefined) data.date = new Date(dto.date);
		if (dto.currency !== undefined) data.currency = dto.currency;

		const row = await this.prisma.transactions.update({
			where: { id: transactionId },
			data,
		});
		return toResponse(row);
	}

	async delete(
		portfolioId: string,
		transactionId: string,
		userId: string,
	): Promise<void> {
		await this.ensurePortfolioAccess(portfolioId, userId);
		const existing = await this.prisma.transactions.findFirst({
			where: { id: transactionId, portfolioId },
		});
		if (!existing) {
			throw new NotFoundException(
				TRANSACTION_ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
			);
		}
		await this.prisma.transactions.delete({ where: { id: transactionId } });
	}
}
