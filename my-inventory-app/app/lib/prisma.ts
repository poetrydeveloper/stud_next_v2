// app/lib/prisma.ts (обновляем)
import { PrismaClient } from "@prisma/client";
import { createLogMiddleware } from './prismaLogMiddleware';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// Подключаем middleware для логирования
createLogMiddleware(prisma);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;