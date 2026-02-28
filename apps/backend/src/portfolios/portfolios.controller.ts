import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';
import { PortfoliosService } from './portfolios.service';

@Controller('portfolios')
@UseGuards(JwtAuthGuard)
export class PortfoliosController {
	constructor(private readonly portfoliosService: PortfoliosService) {}

	@Get()
	getPortfolios(@Request() req: { user: { userId: string } }) {
		return this.portfoliosService.findAllByUserId(req.user.userId);
	}

	@Get('brokers')
	getBrokers() {
		return this.portfoliosService.getBrokers();
	}

	@Post()
	create(
		@Request() req: { user: { userId: string } },
		@Body() body: CreatePortfolioDto,
	) {
		return this.portfoliosService.create(req.user.userId, body);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Request() req: { user: { userId: string } },
		@Body() body: UpdatePortfolioDto,
	) {
		return this.portfoliosService.update(id, req.user.userId, body);
	}

	@Delete(':id')
	async delete(
		@Param('id') id: string,
		@Request() req: { user: { userId: string } },
	) {
		await this.portfoliosService.delete(id, req.user.userId);
	}
}
