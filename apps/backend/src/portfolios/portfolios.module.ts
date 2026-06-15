import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PortfolioSummaryService } from './portfolio-summary.service';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AssetsModule } from '../assets/assets.module';
@Module({
	imports: [
		PrismaModule,
		AuthModule,
		AssetsModule,
		forwardRef(() => TransactionsModule),
	],
	controllers: [PortfoliosController],
	providers: [PortfoliosService, PortfolioSummaryService],
	exports: [PortfoliosService],
})
export class PortfoliosModule {}
