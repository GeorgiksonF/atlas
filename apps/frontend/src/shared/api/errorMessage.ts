import { isAxiosError } from 'axios';

export interface ApiErrorBody {
	message?: string | string[];
	statusCode?: number;
	error?: string;
}

/**
 * Извлекает текст сообщения об ошибке из перехваченного исключения (axios/NestJS).
 * @param err — перехваченное значение (unknown)
 * @param fallback — строка, если сообщение извлечь не удалось
 */
export function getErrorMessage(err: unknown, fallback: string): string {
	if (!isAxiosError(err)) return fallback;
	const data = err.response?.data as ApiErrorBody | undefined;
	const message = data?.message;
	if (message == null) return fallback;
	return Array.isArray(message) ? message[0] : message;
}
