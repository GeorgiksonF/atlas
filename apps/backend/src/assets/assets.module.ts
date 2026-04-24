import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { QuotesModule } from '../quotes/quotes.module';
import { AssetsController } from './assets.controller';
import { AssetsFromExchangeService } from './assets-from-exchange.service';
import { AssetsService } from './assets.service';
import { MoexSearchService } from './moex-search.service';

@Module({
	imports: [AuthModule, forwardRef(() => QuotesModule)],
	controllers: [AssetsController],
	providers: [AssetsService, MoexSearchService, AssetsFromExchangeService],
	exports: [AssetsService],
})
export class AssetsModule {}
