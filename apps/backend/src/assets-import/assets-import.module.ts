import { Module } from '@nestjs/common';

import { AssetsModule } from '../assets/assets.module';
import { AuthModule } from '../auth/auth.module';
import { MoexModule } from '../integrations/moex/moex.module';
import { QuotesModule } from '../quotes/quotes.module';
import { AssetsFromExchangeService } from './assets-from-exchange.service';
import { AssetsImportController } from './assets-import.controller';

@Module({
	imports: [AuthModule, MoexModule, AssetsModule, QuotesModule],
	controllers: [AssetsImportController],
	providers: [AssetsFromExchangeService],
})
export class AssetsImportModule {}
