import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';
import { PortfolioSummaryService } from './portfolio-summary.service';
import { PortfoliosService } from './portfolios.service';

@ApiTags('portfolios')
@ApiBearerAuth()
@Controller('portfolios')
export class PortfoliosController {
	constructor(
		private readonly portfoliosService: PortfoliosService,
		private readonly portfolioSummaryService: PortfolioSummaryService,
	) {}

	@Get()
	getPortfolios(@CurrentUser('userId') userId: string) {
		return this.portfoliosService.findAllByUserId(userId);
	}

	@Get('brokers')
	getBrokers() {
		return this.portfoliosService.getBrokers();
	}

	@Get('summary/all')
	getSummaryAll(@CurrentUser('userId') userId: string) {
		return this.portfolioSummaryService.getSummaryForAllUserPortfolios(
			userId,
		);
	}

	@Get(':id/summary')
	getPortfolioSummary(
		@Param('id') id: string,
		@CurrentUser('userId') userId: string,
	) {
		return this.portfolioSummaryService.getSummaryForPortfolio(id, userId);
	}

	@Get(':id')
	getById(@Param('id') id: string, @CurrentUser('userId') userId: string) {
		return this.portfoliosService.findById(id, userId);
	}

	@Post()
	create(
		@CurrentUser('userId') userId: string,
		@Body() body: CreatePortfolioDto,
	) {
		return this.portfoliosService.create(userId, body);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@CurrentUser('userId') userId: string,
		@Body() body: UpdatePortfolioDto,
	) {
		return this.portfoliosService.update(id, userId, body);
	}

	@Delete(':id')
	async delete(
		@Param('id') id: string,
		@CurrentUser('userId') userId: string,
	) {
		await this.portfoliosService.delete(id, userId);
	}
}
