import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { IsNotEmpty, IsString } from 'class-validator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MoexSearchService } from '../integrations/moex/moex-search.service';
import { AssetsFromExchangeService } from './assets-from-exchange.service';

class EnsureFromExchangeDto {
	@IsString()
	@IsNotEmpty()
	ticker: string;
}

@Controller('assets/import')
@UseGuards(JwtAuthGuard)
export class AssetsImportController {
	constructor(
		private readonly moexSearch: MoexSearchService,
		private readonly assetsFromExchange: AssetsFromExchangeService,
	) {}

	@Get('search')
	async search(@Query('q') q: string) {
		return this.moexSearch.search(q ?? '');
	}

	@Post('from-exchange')
	async ensureFromExchange(@Body() body: EnsureFromExchangeDto) {
		return this.assetsFromExchange.ensureFromExchange(body.ticker);
	}
}
