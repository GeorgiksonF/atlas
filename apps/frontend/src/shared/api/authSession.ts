type UnauthorizedHandler = () => void;

const TOKEN_KEY = 'token';

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function getAuthToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
	unauthorizedHandler = handler;
}

export function handleUnauthorized(): void {
	unauthorizedHandler?.();
}
