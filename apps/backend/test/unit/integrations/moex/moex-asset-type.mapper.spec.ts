import { mapMoexTypeToAssetType } from '@/integrations/moex/moex-asset-type.mapper';

describe('mapMoexTypeToAssetType', () => {
	it('маппит известные типы MOEX', () => {
		expect(mapMoexTypeToAssetType('common_share')).toBe('STOCK');
		expect(mapMoexTypeToAssetType('exchange_bond')).toBe('BOND');
		expect(mapMoexTypeToAssetType('stock_index_pf')).toBe('FUND');
	});

	it('возвращает STOCK для неизвестного типа', () => {
		expect(mapMoexTypeToAssetType('unknown_type')).toBe('STOCK');
	});
});
