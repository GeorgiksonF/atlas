import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { PrismaModule } from './prisma/prisma.module';
import path from 'node:path';
import { AssetsModule } from './assets/assets.module';
import { QuotesModule } from './quotes/quotes.module';

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
		QuotesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
