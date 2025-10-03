// app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { createLogMiddleware } from './prismaLogMiddleware';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// Подключаем middleware для логирования
// Но с защитой от ранней инициализации
if (prisma && typeof prisma.$use === 'function') {
  try {
    createLogMiddleware(prisma);
    console.log('✅ Prisma middleware initialized successfully');
  } catch (error) {
    console.warn('⚠️ Middleware initialization failed, continuing without it:', error);
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;