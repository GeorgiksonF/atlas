import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@atlas/database';
import type {
	RegisterRequest,
	RegisterResponse,
	LoginRequest,
} from '@atlas/types';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterRequest) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: registerDto.email },
		});

		if (existingUser) {
			throw new UnauthorizedException('User already exists');
		}

		if (registerDto.password !== registerDto.confirmPassword) {
			throw new BadRequestException('Пароли не совпадают');
		}

		const passwordHash = await bcrypt.hash(registerDto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: registerDto.email,
				name: registerDto.name,
				passwordHash,
			},
		});

		const payload = { email: user.email, sub: user.id };
		const token = this.jwtService.sign(payload);

		const response: RegisterResponse = {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			token,
		};
		return response;
	}

	async login(loginDto: LoginRequest) {
		const user = await this.prisma.user.findUnique({
			where: { email: loginDto.email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(
			loginDto.password,
			user.passwordHash,
		);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { email: user.email, sub: user.id };
		const token = this.jwtService.sign(payload);

		return {
			access_token: token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		};
	}
}
