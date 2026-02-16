import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import path from 'node:path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: path.resolve(__dirname, '../../../.env'),
		}),
		PrismaModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
