import { Module } from '@nestjs/common';

import { MoexHttpClient } from './moex-http.client';
import { MoexSearchService } from './moex-search.service';

@Module({
	providers: [MoexHttpClient, MoexSearchService],
	exports: [MoexHttpClient, MoexSearchService],
})
export class MoexModule {}
