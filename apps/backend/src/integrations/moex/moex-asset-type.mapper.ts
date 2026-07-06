import type { AssetType } from '@atlas/types';

const MOEX_TYPE_TO_ASSET: Record<string, AssetType> = {
	common_share: 'STOCK',
	preferred_share: 'STOCK',
	exchange_bond: 'BOND',
	corporate_bond: 'BOND',
	stock_index_pf: 'FUND',
	stock_index_if: 'FUND',
};

export function mapMoexTypeToAssetType(moexType: string): AssetType {
	return MOEX_TYPE_TO_ASSET[moexType] ?? 'STOCK';
}
