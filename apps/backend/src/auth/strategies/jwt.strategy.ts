import { PrismaClient } from '@atlas/database';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly prisma: PrismaClient;

	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: { sub: string; email: string }) {
		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
		});

		return { userId: user.id, email: user.email };
	}
}
