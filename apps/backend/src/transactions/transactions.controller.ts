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
import {
	CreateTransactionDto,
	UpdateTransactionDto,
} from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('portfolios/:portfolioId/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) {}

	@Get()
	findAll(
		@Param('portfolioId') portfolioId: string,
		@Request() req: { user: { userId: string } },
	) {
		return this.transactionsService.findAllByPortfolioId(
			portfolioId,
			req.user.userId,
		);
	}

	@Get(':id')
	findOne(
		@Param('portfolioId') portfolioId: string,
		@Param('id') id: string,
		@Request() req: { user: { userId: string } },
	) {
		return this.transactionsService.findById(
			portfolioId,
			id,
			req.user.userId,
		);
	}

	@Post()
	create(
		@Param('portfolioId') portfolioId: string,
		@Request() req: { user: { userId: string } },
		@Body() body: CreateTransactionDto,
	) {
		return this.transactionsService.create(portfolioId, req.user.userId, {
			...body,
			assetId: body.assetId ?? null,
		});
	}

	@Patch(':id')
	update(
		@Param('portfolioId') portfolioId: string,
		@Param('id') id: string,
		@Request() req: { user: { userId: string } },
		@Body() body: UpdateTransactionDto,
	) {
		return this.transactionsService.update(
			portfolioId,
			id,
			req.user.userId,
			body,
		);
	}

	@Delete(':id')
	async delete(
		@Param('portfolioId') portfolioId: string,
		@Param('id') id: string,
		@Request() req: { user: { userId: string } },
	) {
		await this.transactionsService.delete(portfolioId, id, req.user.userId);
	}
}
