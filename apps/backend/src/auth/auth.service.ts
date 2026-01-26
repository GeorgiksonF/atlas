import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@atlas/database';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaClient,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: registerDto.email },
		});

		if (existingUser) {
			throw new UnauthorizedException('User already exists');
		}

		const passwordHash = await bcrypt.hash(registerDto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: registerDto.email,
				name: registerDto.name,
				passwordHash,
			},
		});

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}

	async login(loginDto: LoginDto) {
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
