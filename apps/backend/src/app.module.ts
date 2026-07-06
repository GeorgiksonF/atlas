import path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AssetsModule } from './assets/assets.module';
import { AssetsImportModule } from './assets-import/assets-import.module';
import { AuthModule } from './auth/auth.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuotesModule } from './quotes/quotes.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: path.resolve(__dirname, '../../../.env'),
		}),
		ScheduleModule.forRoot(),
		PrismaModule,
		AuthModule,
		PortfoliosModule,
		AssetsModule,
		AssetsImportModule,
		QuotesModule,
		TransactionsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
