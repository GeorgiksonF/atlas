export interface RegisterRequest {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
}

export interface RegisterResponse {
	user: {
		id: string;
		email: string;
		name: string;
	};
	token: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}