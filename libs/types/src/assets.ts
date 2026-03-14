export type AssetType = 'STOCK' | 'BOND' | 'FUND';

export type CreateAsset = {
	name: string;
	ticker: string;
	type: AssetType;
};

export type UpdateAsset = Partial<CreateAsset>;

export type AssetResponse = {
	id: string;
	name: string;
	ticker: string;
	type: AssetType;
	createdAt: Date;
	updatedAt: Date;
};

export type AssetsResponse = AssetResponse[];
