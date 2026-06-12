import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PortfoliosModule } from '../portfolios/portfolios.module';
import { AssetsModule } from '../assets/assets.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
	imports: [AuthModule, AssetsModule, forwardRef(() => PortfoliosModule)],
	controllers: [TransactionsController],
	providers: [TransactionsService],
	exports: [TransactionsService],
})
export class TransactionsModule {}
