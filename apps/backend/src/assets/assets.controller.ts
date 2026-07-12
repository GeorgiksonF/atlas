import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AssetsService } from './assets.service';

@ApiTags('assets')
@ApiBearerAuth()
@Controller('assets')
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
