export type PortfolioBroker =
	| 'T_INVESTMENT'
	| 'SBER'
	| 'VTP'
	| 'ALPHA'
	| 'OTKRITIE'
	| 'BKS'
	| 'FINAM';

export type BrokerResponse = {
    value: PortfolioBroker,
    label: string
}