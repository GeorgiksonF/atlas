import type { CurrencyType } from './quotes';

export type PortfolioSummaryResponse = {
	/** 
	 * ОБщая текущая рыночная стоимость портфеля с учетом ценных бумаг и кэша
	 */
	totalValue: number;
	/** 
	 * Текущая рыночная стоимость всех ценных бумаг в составе портфеля
	 */
	marketValue: number;
	/** 
	 * Текущий баланс денежных средств портфеля включая валюту
	 */
	cashBalance: number;
	/** 
	 * Абсолютный результат портфеля за все время отраженный в деньгах
	 */
	profit: number;
	/** 
	 * Абсолютный результат портфеля в деньгах выраженный в процентах по отношению к чистым пополнениям (null если чистые пополнения близки к нулю)
	 */
	profitPercentOfNetInvested: number | null;
	/** 
	 * Годовая доходность портфеля (XIRR), % годовых
	 */
	annualizedReturnPercent: number | null;
	/** 
	 * Изменение рыночной стоимости портфеля в деньгах за последние сутки
	 */
	dayChangeAmount: number;
	/** 
	 * Изменение рыночной стоимости портфеля в процентах за последние сутки
	 */
	dayChangePercent: number | null;
	/** 
	 * Базовая валюта для расчета сводки
	 */
	primaryCurrency: CurrencyType;
	/** 
	 * Дополнительная валюта для рассчтеа рядом
	 */
	alternativeCurrency: CurrencyType | null;
	/** 
	 * Эквивалент totalValue пересчитанный в альтернативной валюте (если эта валюта задана)
	 */
	alternativeTotalValue: number | null;
};
