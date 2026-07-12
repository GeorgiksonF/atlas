export const PORTFOLIO_BROKERS = [
	'T_INVESTMENT',
	'SBER',
	'VTB',
	'ALPHA',
	'OTKRITIE',
	'BKS',
	'FINAM',
] as const;

export type PortfolioBroker = (typeof PORTFOLIO_BROKERS)[number];

export type BrokerResponse = {
	value: PortfolioBroker;
	label: string;
};
