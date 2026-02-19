export const validation = {
	name: {
		required: 'Имя обязательно',
		min: 'Имя должно содержать минимум 2 символа',
		max: 'Имя не должно превышать 50 символов',
	},
	email: {
		required: 'Email обязателен',
		invalid: 'Введите корректный email',
	},
	password: {
		required: 'Пароль обязателен',
		min: 'Пароль должен содержать минимум 6 символов',
		max: 'Пароль не должен превышать 100 символов',
	},
	confirmPassword: {
		required: 'Подтвердите пароль',
		mismatch: 'Пароли не совпадают',
	},
} as const;

export const register = {
	toastSuccessSummary: 'Регистрация',
	toastSuccessDetail: 'Вы успешно зарегистрированы.',
	toastErrorSummary: 'Ошибка регистрации',
	errorFallback: 'Ошибка регистрации. Попробуйте позже.',
} as const;

export const login = {
	toastSuccessSummary: 'Вход',
	toastSuccessDetail: 'Вы успешно вошли в систему.',
	toastErrorSummary: 'Ошибка входа',
	errorFallback: 'Ошибка входа. Проверьте email и пароль.',
} as const;
