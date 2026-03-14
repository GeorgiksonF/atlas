export const TRANSACTION_ERROR_MESSAGES = {
	PORTFOLIO_ACCESS_DENIED: 'Нет доступа к портфелю',
	PORTFOLIO_NOT_FOUND: 'Портфель не найден',
	TRANSACTION_NOT_FOUND: 'Транзакция не найдена',
	ASSET_REQUIRED_FOR_TRADE:
		'Для операций покупки/продажи необходимо указать актив',
	ASSET_FORBIDDEN_FOR_CASH: 'Для внесения и вывода актив не указывается',
	ASSET_NOT_FOUND: 'Актив не найден',
	USER_ID_REQUIRED: 'Идентификатор пользователя обязателен',
} as const;
