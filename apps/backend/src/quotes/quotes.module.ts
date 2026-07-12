import { Module } from '@nestjs/common';

import { AssetsModule } from '../assets/assets.module';
import { FxModule } from '../fx/fx.module';
import { MoexModule } from '../integrations/moex/moex.module';
import { QUOTE_PROVIDER } from './contract/quote-provider.interface';
import { QuoteRepository } from './persistence/quote.repository';
import { QuoteSnapshotRepository } from './persistence/quote-snapshot.repository';
import { MoexQuoteProvider } from './providers/moex/moex-quote.provider';
import { QuotesSyncService } from './quotes-sync.service';

@Module({
	imports: [AssetsModule, MoexModule, FxModule],
	providers: [
		MoexQuoteProvider,
		{ provide: QUOTE_PROVIDER, useExisting: MoexQuoteProvider },
		QuoteRepository,
		QuoteSnapshotRepository,
		QuotesSyncService,
	],
	exports: [QUOTE_PROVIDER, QuoteRepository, QuoteSnapshotRepository],
})
export class QuotesModule {}
