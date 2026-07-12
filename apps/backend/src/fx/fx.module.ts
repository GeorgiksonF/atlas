import { Module } from '@nestjs/common';

import { MoexModule } from '../integrations/moex/moex.module';
import { FX_RATE_PROVIDER } from './contract/fx-rate-provider.interface';
import { FxRateService } from './fx-rate.service';
import { FxSnapshotRepository } from './persistence/fx-snapshot.repository';
import { MoexFxRateProvider } from './providers/moex/moex-fx-rate.provider';

@Module({
	imports: [MoexModule],
	providers: [
		MoexFxRateProvider,
		{ provide: FX_RATE_PROVIDER, useExisting: MoexFxRateProvider },
		FxSnapshotRepository,
		FxRateService,
	],
	exports: [FxRateService, FxSnapshotRepository],
})
export class FxModule {}
