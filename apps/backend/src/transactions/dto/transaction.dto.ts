import type { CreateTransaction, UpdateTransaction } from '@atlas/types';
import { TRANSACTION_TYPES } from '../constants/transactionTypes';
import {
	IsDateString,
	IsIn,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	IsUUID,
} from 'class-validator';

const CURRENCIES = ['RUB', 'USD'] as const;

export class CreateTransactionDto implements CreateTransaction {
	@IsOptional()
	@IsUUID()
	assetId?: string | null;

	@IsNumber()
	@IsPositive()
	quantity: number;

	@IsNumber()
	@IsPositive()
	price: number;

	@IsString()
	@IsIn([...TRANSACTION_TYPES])
	type: CreateTransaction['type'];

	@IsDateString()
	date: string;

	@IsString()
	@IsIn([...CURRENCIES])
	currency: CreateTransaction['currency'];
}

export class UpdateTransactionDto implements UpdateTransaction {
	@IsOptional()
	@IsUUID()
	assetId?: string | null;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	quantity?: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	price?: number;

	@IsOptional()
	@IsString()
	@IsIn([...TRANSACTION_TYPES])
	type?: UpdateTransaction['type'];

	@IsOptional()
	@IsDateString()
	date?: string;

	@IsOptional()
	@IsString()
	@IsIn([...CURRENCIES])
	currency?: UpdateTransaction['currency'];
}
