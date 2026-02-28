export const PORTFOLIO_BROKERS = [
	'Тинькофф Инвестиции',
	'Сбербанк Инвестор',
	'ВТБ Мои Инвестиции',
	'Альфа-Банк',
	'Открытие Брокер',
	'БКС',
	'Финам',
	'ИТИ Капитал',
	'Другой',
] as const;

export type PortfolioBroker = (typeof PORTFOLIO_BROKERS)[number];
