import type { PortfolioBroker } from '@atlas/types';

export const PORTFOLIO_BROKERS = {
	T_INVESTMENT: 'Т-Инвестиции',
	SBER: 'Сбербанк Инвестор',
	VTB: 'ВТБ Мои Инвестиции',
	ALPHA: 'Альфа-Банк',
	OTKRITIE: 'Открытие Брокер',
	BKS: 'БКС',
	FINAM: 'Финам',
} as const satisfies Record<PortfolioBroker, string>;

export const isPortfolioBroker = (key: string): key is PortfolioBroker => {
	return key in PORTFOLIO_BROKERS;
};
