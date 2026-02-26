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

				return createPrismaClient(url);
			},
			inject: [ConfigService],
		},
	],
	exports: [PrismaClient],
})
export class PrismaModule {}
