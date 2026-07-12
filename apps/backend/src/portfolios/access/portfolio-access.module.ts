import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { PortfolioAccessService } from './portfolio-access.service';

@Module({
	imports: [PrismaModule],
	providers: [PortfolioAccessService],
	exports: [PortfolioAccessService],
})
export class PortfolioAccessModule {}
