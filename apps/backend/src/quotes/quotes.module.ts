import { forwardRef, Module } from '@nestjs/common';

import { AssetsModule } from '../assets/assets.module';
import { QUOTE_PROVIDER } from './contract/quote-provider.interface';
import { QuoteRepository } from './persistence/quote.repository';
import { MoexQuoteProvider } from './providers/moex/moex-quote.provider';
import { QuotesSyncService } from './quotes-sync.service';

@Module({
	imports: [forwardRef(() => AssetsModule)],
	providers: [
		MoexQuoteProvider,
		{ provide: QUOTE_PROVIDER, useExisting: MoexQuoteProvider },
		QuoteRepository,
		QuotesSyncService,
	],
	exports: [QUOTE_PROVIDER, QuoteRepository],
})
export class QuotesModule {}
