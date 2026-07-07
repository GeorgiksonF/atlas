export const TRANSACTION_ERROR_MESSAGES = {
	TRANSACTION_NOT_FOUND: 'Транзакция не найдена',
	ASSET_REQUIRED_FOR_TRADE:
		'Для операций покупки/продажи необходимо указать актив',
	ASSET_FORBIDDEN_FOR_CASH: 'Для внесения и вывода актив не указывается',
	INSUFFICIENT_ASSET_QUANTITY: 'Недостаточно актива для продажи',
} as const;
