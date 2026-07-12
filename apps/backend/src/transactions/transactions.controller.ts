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
import {
	CreateTransactionDto,
	UpdateTransactionDto,
} from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('portfolios/:portfolioId/transactions')
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@Get()
	findAll(
		@Param('portfolioId') portfolioId: string,
		@CurrentUser('userId') userId: string,
	) {
		return this.transactionsService.findAllByPortfolioId(
			portfolioId,
			userId,
		);
	}

	@Get(':id')
	findOne(
		@Param('portfolioId') portfolioId: string,
		@Param('id') id: string,
		@CurrentUser('userId') userId: string,
	) {
		return this.transactionsService.findById(portfolioId, id, userId);
	}

	@Post()
	create(
		@Param('portfolioId') portfolioId: string,
		@CurrentUser('userId') userId: string,
		@Body() body: CreateTransactionDto,
	) {
		return this.transactionsService.create(portfolioId, userId, {
			...body,
			assetId: body.assetId ?? null,
		});
	}

	@Patch(':id')
	update(
		@Param('portfolioId') portfolioId: string,
		@Param('id') id: string,
		@CurrentUser('userId') userId: string,
		@Body() body: UpdateTransactionDto,
	) {
		return this.transactionsService.update(portfolioId, id, userId, body);
	}

	@Delete(':id')
	async delete(
		@Param('portfolioId') portfolioId: string,
		@Param('id') id: string,
		@CurrentUser('userId') userId: string,
	) {
		await this.transactionsService.delete(portfolioId, id, userId);
	}
}
