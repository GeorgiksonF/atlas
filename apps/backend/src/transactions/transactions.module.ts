import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { AssetsModule } from '../assets/assets.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
	imports: [AuthModule, PortfoliosModule, AssetsModule],
	controllers: [TransactionsController],
	providers: [TransactionsService],
})
export class TransactionsModule {}
