import type { User } from './user';

export interface RegisterRequest {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	accessToken: string;
	user: User;
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;
