import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPrismaClient, PrismaClient } from '@atlas/database';

@Global()
@Module({
	providers: [
		{
			provide: PrismaClient,
			useFactory: (config: ConfigService): PrismaClient => {
				const url = config.getOrThrow<string>('DATABASE_URL');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- типы из @atlas/database не резолвятся в ESLint
				return createPrismaClient(url);
			},
			inject: [ConfigService],
		},
	],
	exports: [PrismaClient],
})
export class PrismaModule {}
