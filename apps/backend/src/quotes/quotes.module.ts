import { Module } from '@nestjs/common';
import { AssetsModule } from '../assets/assets.module';
import { QUOTE_PROVIDER } from './contract/quote-provider.interface';
import { MoexQuoteProvider } from './providers/moex/moex-quote.provider';
import { QuotesSyncService } from './quotes-sync.service';

@Module({
	imports: [AssetsModule],
	providers: [
		MoexQuoteProvider,
		{ provide: QUOTE_PROVIDER, useExisting: MoexQuoteProvider },
		QuotesSyncService,
	],
})
export class QuotesModule {}
