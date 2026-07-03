import { Module } from '@nestjs/common';

import { AssetsModule } from '../assets/assets.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { PortfolioAccessModule } from './access/portfolio-access.module';
import { PortfolioSummaryService } from './portfolio-summary.service';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
	imports: [
		PrismaModule,
		AuthModule,
		AssetsModule,
		PortfolioAccessModule,
		TransactionsModule,
	],
	controllers: [PortfoliosController],
	providers: [PortfoliosService, PortfolioSummaryService],
	exports: [PortfoliosService],
})
export class PortfoliosModule {}
