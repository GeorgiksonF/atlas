import type { CreateAsset, UpdateAsset } from '@atlas/types';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const ASSET_TYPES = ['STOCK', 'BOND', 'FUND'] as const;

export class CreateAssetDto implements CreateAsset {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	ticker: string;

	@IsString()
	@IsIn([...ASSET_TYPES])
	type: CreateAsset['type'];
}

export class UpdateAssetDto implements UpdateAsset {
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	name?: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	ticker?: string;

	@IsString()
	@IsOptional()
	@IsIn([...ASSET_TYPES])
	type?: UpdateAsset['type'];
}
