import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { MoexSearchService } from '../integrations/moex/moex-search.service';
import { AssetsFromExchangeService } from './assets-from-exchange.service';

class EnsureFromExchangeDto {
	@IsString()
	@IsNotEmpty()
	ticker: string;
}

@ApiTags('assets-import')
@ApiBearerAuth()
@Controller('assets/import')
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
