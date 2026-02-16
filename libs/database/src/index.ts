import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

export function createPrismaClient(connectionString: string): PrismaClient {
	const adapter = new PrismaPg({ connectionString });
	return new PrismaClient({ adapter });
}

export { PrismaClient, Prisma } from '../generated/prisma/client.js';
export type { User, Portfolio, Asset, Transactions } from '../generated/prisma/client.js';