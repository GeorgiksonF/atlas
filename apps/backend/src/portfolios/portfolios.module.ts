import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [PrismaModule, AuthModule],
	controllers: [PortfoliosController],
	providers: [PortfoliosService],
})
export class PortfoliosModule {}
