import { BadRequestException } from '@nestjs/common';

import type { Transaction } from '@atlas/database';
import type {
	CreateTransaction,
	TransactionType,
	UpdateTransaction,
} from '@atlas/types';

import { TRANSACTION_ERROR_MESSAGES } from '../constants/messages';
import { isCashType, isTradeType } from './transaction-type.utils';

export const assertValidCreatePayload = (dto: CreateTransaction): void => {
	if (isTradeType(dto.type) && !dto.assetId) {
		throw new BadRequestException(
			TRANSACTION_ERROR_MESSAGES.ASSET_REQUIRED_FOR_TRADE,
		);
	}

	if (isCashType(dto.type) && dto.assetId != null && dto.assetId !== '') {
		throw new BadRequestException(
			TRANSACTION_ERROR_MESSAGES.ASSET_FORBIDDEN_FOR_CASH,
		);
	}
};

export type NormalizedCreateTransactionData = {
	portfolioId: string;
	assetId: string | null;
	quantity: number;
	price: number;
	type: TransactionType;
	date: Date;
	currency: CreateTransaction['currency'];
};

export const normalizeCreatePayload = (
	dto: CreateTransaction,
	portfolioId: string,
): NormalizedCreateTransactionData => ({
	portfolioId,
	assetId: isCashType(dto.type) ? null : (dto.assetId ?? null),
	quantity: isCashType(dto.type) ? 1 : dto.quantity,
	price: dto.price,
	type: dto.type,
	date: new Date(dto.date),
	currency: dto.currency,
});

export const resolveEffectiveType = (
	dto: UpdateTransaction,
	existing: Transaction,
): TransactionType => dto.type ?? existing.type;

export const resolveEffectiveAssetId = (
	dto: UpdateTransaction,
	existing: Transaction,
	effectiveType: TransactionType,
): string | null => {
	if (isCashType(effectiveType)) {
		return null;
	}

	if (dto.assetId !== undefined) {
		return dto.assetId;
	}

	return existing.assetId;
};

export type EffectiveUpdateState = {
	effectiveType: TransactionType;
	effectiveAssetId: string | null;
};

export const assertValidUpdatePayload = (
	dto: UpdateTransaction,
	existing: Transaction,
): EffectiveUpdateState => {
	const effectiveType = resolveEffectiveType(dto, existing);
	const effectiveAssetId = resolveEffectiveAssetId(
		dto,
		existing,
		effectiveType,
	);

	if (isTradeType(effectiveType) && !effectiveAssetId) {
		throw new BadRequestException(
			TRANSACTION_ERROR_MESSAGES.ASSET_REQUIRED_FOR_TRADE,
		);
	}

	if (
		isCashType(effectiveType) &&
		dto.assetId != null &&
		dto.assetId !== ''
	) {
		throw new BadRequestException(
			TRANSACTION_ERROR_MESSAGES.ASSET_FORBIDDEN_FOR_CASH,
		);
	}

	return { effectiveType, effectiveAssetId };
};

export type NormalizedUpdateTransactionData = {
	assetId?: string | null;
	quantity?: number;
	price?: number;
	type?: TransactionType;
	date?: Date;
	currency?: UpdateTransaction['currency'];
};

export const normalizeUpdateData = (
	dto: UpdateTransaction,
	existing: Transaction,
	effectiveType: TransactionType,
	effectiveAssetId: string | null,
): NormalizedUpdateTransactionData => {
	const typeChanged = dto.type !== undefined && dto.type !== existing.type;
	const assetIdProvided = dto.assetId !== undefined;

	const data: NormalizedUpdateTransactionData = {};

	if (typeChanged && isCashType(effectiveType)) {
		data.assetId = null;
		data.quantity = 1;
	} else if (assetIdProvided || (typeChanged && isTradeType(effectiveType))) {
		data.assetId = effectiveAssetId;
	}

	if (dto.type !== undefined) {
		data.type = dto.type;
	}

	if (dto.price !== undefined) {
		data.price = dto.price;
	}

	if (dto.currency !== undefined) {
		data.currency = dto.currency;
	}

	if (dto.date !== undefined) {
		data.date = new Date(dto.date);
	}

	if (
		dto.quantity !== undefined &&
		!(typeChanged && isCashType(effectiveType))
	) {
		data.quantity = isCashType(effectiveType) ? 1 : dto.quantity;
	}

	return data;
};
