import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { EnsureFromExchangeDto } from './dto/ensure-from-exchange.dto';
import { AssetsFromExchangeService } from './assets-from-exchange.service';
import { AssetsService } from './assets.service';
import { MoexSearchService } from './moex-search.service';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
	constructor(
		private readonly assetsService: AssetsService,
		private readonly moexSearch: MoexSearchService,
		private readonly assetsFromExchange: AssetsFromExchangeService,
	) {}

	@Get()
	getAll() {
		return this.assetsService.findAll();
	}

	@Get('search')
	async search(@Query('q') q: string) {
		return this.moexSearch.search(q ?? '');
	}

	@Post('from-exchange')
	async ensureFromExchange(@Body() body: EnsureFromExchangeDto) {
		return this.assetsFromExchange.ensureFromExchange(body.ticker);
	}

	@Get(':id')
	getById(@Param('id') id: string) {
		return this.assetsService.findById(id);
	}

	@Post()
	create(@Body() body: CreateAssetDto) {
		return this.assetsService.create(body);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() body: UpdateAssetDto) {
		return this.assetsService.update(id, body);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		await this.assetsService.delete(id);
	}
}
