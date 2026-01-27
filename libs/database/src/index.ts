import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
export const prisma: PrismaClient = new PrismaClient({ adapter });

export { PrismaClient, Prisma } from "../generated/prisma/client.js";
export type { User, Portfolio, Asset, Transactions } from "../generated/prisma/client.js";