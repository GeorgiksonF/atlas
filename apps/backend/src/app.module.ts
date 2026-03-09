import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { PrismaModule } from './prisma/prisma.module';
import path from 'node:path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: path.resolve(__dirname, '../../../.env'),
		}),
		PrismaModule,
		AuthModule,
		PortfoliosModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
