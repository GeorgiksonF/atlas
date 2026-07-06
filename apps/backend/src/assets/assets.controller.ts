import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssetsService } from './assets.service';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
	constructor(private readonly assetsService: AssetsService) {}

	@Get()
	getAll() {
		return this.assetsService.findAll();
	}

	@Get(':id')
	getById(@Param('id') id: string) {
		return this.assetsService.findById(id);
	}
}
