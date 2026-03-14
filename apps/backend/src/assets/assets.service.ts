import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@atlas/database';
import type {
	AssetResponse,
	AssetsResponse,
	CreateAsset,
	UpdateAsset,
} from '@atlas/types';
import { ASSET_ERROR_MESSAGES } from './constants/messages';

@Injectable()
export class AssetsService {
	constructor(private readonly prisma: PrismaClient) {}

	async findAll(): Promise<AssetsResponse> {
		return this.prisma.asset.findMany({
			orderBy: { ticker: 'asc' },
		});
	}

	async findById(id: string): Promise<AssetResponse> {
		const asset = await this.prisma.asset.findUnique({
			where: { id },
		});
		if (!asset) {
			throw new NotFoundException(ASSET_ERROR_MESSAGES.ASSET_NOT_FOUND);
		}
		return asset;
	}

	async findByTicker(ticker: string): Promise<AssetResponse | null> {
		return this.prisma.asset.findUnique({
			where: { ticker: ticker.toUpperCase() },
		});
	}

	async create(dto: CreateAsset): Promise<AssetResponse> {
		const ticker = dto.ticker.trim().toUpperCase();
		const existing = await this.prisma.asset.findUnique({
			where: { ticker },
		});
		if (existing) {
			throw new BadRequestException(
				ASSET_ERROR_MESSAGES.TICKER_ALREADY_EXISTS,
			);
		}
		return this.prisma.asset.create({
			data: {
				name: dto.name.trim(),
				ticker,
				type: dto.type,
			},
		});
	}

	async update(id: string, dto: UpdateAsset): Promise<AssetResponse> {
		const asset = await this.prisma.asset.findUnique({ where: { id } });
		if (!asset) {
			throw new NotFoundException(ASSET_ERROR_MESSAGES.ASSET_NOT_FOUND);
		}
		const data: {
			name?: string;
			ticker?: string;
			type?: UpdateAsset['type'];
		} = {};
		if (dto.name !== undefined) data.name = dto.name.trim();
		if (dto.ticker !== undefined) {
			const ticker = dto.ticker.trim().toUpperCase();
			if (ticker !== asset.ticker) {
				const existing = await this.prisma.asset.findUnique({
					where: { ticker },
				});
				if (existing) {
					throw new BadRequestException(
						ASSET_ERROR_MESSAGES.TICKER_ALREADY_EXISTS,
					);
				}
				data.ticker = ticker;
			}
		}
		if (dto.type !== undefined) data.type = dto.type;
		return this.prisma.asset.update({
			where: { id },
			data,
		});
	}

	async delete(id: string): Promise<void> {
		const asset = await this.prisma.asset.findUnique({ where: { id } });
		if (!asset) {
			throw new NotFoundException(ASSET_ERROR_MESSAGES.ASSET_NOT_FOUND);
		}
		await this.prisma.asset.delete({ where: { id } });
	}
}
