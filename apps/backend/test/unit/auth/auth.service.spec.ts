jest.mock('@atlas/database', () => ({
	PrismaClient: class PrismaClient {},
}));

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}));

import {
	BadRequestException,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthService } from '@/auth/auth.service';

const mockUser = {
	id: 'user-1',
	email: 'test@example.com',
	name: 'Test User',
	passwordHash: 'hashed',
};

describe('AuthService', () => {
	let authService: AuthService;
	let prisma: {
		user: {
			findUnique: jest.Mock;
			create: jest.Mock;
		};
	};
	let jwtService: { sign: jest.Mock };

	beforeEach(() => {
		jest.clearAllMocks();
		prisma = {
			user: {
				findUnique: jest.fn(),
				create: jest.fn(),
			},
		};
		jwtService = {
			sign: jest.fn().mockReturnValue('signed-jwt'),
		};

		authService = new AuthService(
			prisma as never,
			jwtService as unknown as JwtService,
		);
	});

	describe('register', () => {
		it('возвращает AuthResponse с accessToken и user', async () => {
			prisma.user.findUnique.mockResolvedValue(null);
			prisma.user.create.mockResolvedValue(mockUser);
			(bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

			const result = await authService.register({
				email: mockUser.email,
				password: 'password123',
				confirmPassword: 'password123',
				name: mockUser.name,
			});

			expect(result).toEqual({
				accessToken: 'signed-jwt',
				user: {
					id: mockUser.id,
					email: mockUser.email,
					name: mockUser.name,
				},
			});
			expect(jwtService.sign).toHaveBeenCalledWith({
				email: mockUser.email,
				sub: mockUser.id,
			});
		});

		it('бросает ConflictException, если email уже занят', async () => {
			prisma.user.findUnique.mockResolvedValue(mockUser);

			await expect(
				authService.register({
					email: mockUser.email,
					password: 'password123',
					confirmPassword: 'password123',
					name: mockUser.name,
				}),
			).rejects.toBeInstanceOf(ConflictException);
		});

		it('бросает BadRequestException, если пароли не совпадают', async () => {
			prisma.user.findUnique.mockResolvedValue(null);

			await expect(
				authService.register({
					email: mockUser.email,
					password: 'password123',
					confirmPassword: 'different',
					name: mockUser.name,
				}),
			).rejects.toBeInstanceOf(BadRequestException);
		});
	});

	describe('login', () => {
		it('возвращает AuthResponse с accessToken и user', async () => {
			prisma.user.findUnique.mockResolvedValue(mockUser);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);

			const result = await authService.login({
				email: mockUser.email,
				password: 'password123',
			});

			expect(result).toEqual({
				accessToken: 'signed-jwt',
				user: {
					id: mockUser.id,
					email: mockUser.email,
					name: mockUser.name,
				},
			});
		});

		it('бросает UnauthorizedException при неверных credentials', async () => {
			prisma.user.findUnique.mockResolvedValue(null);

			await expect(
				authService.login({
					email: mockUser.email,
					password: 'wrong',
				}),
			).rejects.toBeInstanceOf(UnauthorizedException);
		});
	});
});
