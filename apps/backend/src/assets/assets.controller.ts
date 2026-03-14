import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
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
