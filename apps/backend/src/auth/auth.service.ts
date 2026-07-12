import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaClient } from '@atlas/database';
import type {
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	User,
} from '@atlas/types';

import * as bcrypt from 'bcrypt';

import { AUTH_ERROR_MESSAGES } from './constants/messages';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly jwtService: JwtService,
	) {}

	private buildAuthResponse(user: {
		id: string;
		email: string;
		name: string;
	}): AuthResponse {
		const payload = { email: user.email, sub: user.id };
		const accessToken = this.jwtService.sign(payload);

		const authUser: User = {
			id: user.id,
			email: user.email,
			name: user.name,
		};

		return { accessToken, user: authUser };
	}

	async register(registerDto: RegisterRequest): Promise<AuthResponse> {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: registerDto.email },
		});

		if (existingUser) {
			throw new ConflictException(
				AUTH_ERROR_MESSAGES.USER_ALREADY_EXISTS,
			);
		}

		if (registerDto.password !== registerDto.confirmPassword) {
			throw new BadRequestException(
				AUTH_ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
			);
		}

		const passwordHash = await bcrypt.hash(registerDto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: registerDto.email,
				name: registerDto.name,
				passwordHash,
			},
		});

		return this.buildAuthResponse(user);
	}

	async login(loginDto: LoginRequest): Promise<AuthResponse> {
		const user = await this.prisma.user.findUnique({
			where: { email: loginDto.email },
		});

		if (!user) {
			throw new UnauthorizedException(
				AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
			);
		}

		const isPasswordValid = await bcrypt.compare(
			loginDto.password,
			user.passwordHash,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException(
				AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
			);
		}

		return this.buildAuthResponse(user);
	}
}
