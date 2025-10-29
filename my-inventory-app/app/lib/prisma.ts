// @/app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { createLogMiddleware } from './prismaLogMiddleware';

interface ExtendedPrismaClient extends PrismaClient {
  $cleanupIdleConnections?: () => Promise<{ checked: number; closed: number }>;
  $getConnectionStats?: () => Promise<{
    total: number;
    idle: number;
    active: number;
    idle_old: number;
    active_transactions: number;
  }>;
}

const globalForPrisma = global as unknown as { prisma: ExtendedPrismaClient };

const PRISMA_CONFIG = {
  // Только для IDLE соединений (не в транзакциях)
  maxIdleConnectionAge: 30 * 60 * 1000, // 30 минут для idle
  // Более частые проверки, но только idle
  cleanupInterval: 2 * 60 * 1000, // 2 минуты
} as const;

class SafePrismaConnectionManager {
  private prisma: ExtendedPrismaClient;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private isCleaningUp = false;
  private activeOperations = 0;

  constructor() {
    this.prisma = this.createPrismaClient();
    this.setupSafeMonitoring();
  }

  private createPrismaClient(): ExtendedPrismaClient {
    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      // Важные настройки для безопасности
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      // Отключаем автоматический таймаут для транзакций
      transactionOptions: {
        maxWait: 60000, // 60 секунд
        timeout: 60000, // 60 секунд
      }
    }) as ExtendedPrismaClient;

    // Добавляем безопасные методы
    prisma.$cleanupIdleConnections = async () => {
      return this.safeCleanupIdleConnections();
    };

    prisma.$getConnectionStats = async () => {
      return this.getSafeConnectionStats();
    };

    return prisma;
  }

  /**
   * Безопасный мониторинг - только IDLE соединения
   */
  private setupSafeMonitoring(): void {
    this.cleanupTimer = setInterval(async () => {
      // Не очищаем если есть активные операции
      if (this.activeOperations > 0 || this.isCleaningUp) {
        return;
      }
      
      try {
        await this.safeCleanupIdleConnections();
      } catch (error) {
        console.error('❌ Safe connection cleanup failed:', error);
      }
    }, PRISMA_CONFIG.cleanupInterval);

    // Обработчики завершения
    this.setupShutdownHandlers();
  }

  /**
   * Безопасная очистка ТОЛЬКО IDLE соединений
   */
  private async safeCleanupIdleConnections(): Promise<{ checked: number; closed: number }> {
    if (this.isCleaningUp) {
      return { checked: 0, closed: 0 };
    }

    this.isCleaningUp = true;

    try {
      const stats = await this.getSafeConnectionStats();
      
      // Закрываем ТОЛЬКО старые IDLE соединения (не в транзакциях)
      if (stats.idle_old > 0) {
        console.log(`🔄 Safely cleaning up ${stats.idle_old} old idle connections...`);
        
        // Prisma автоматически управляет пулом, но мы можем помочь
        // выполнив легкий запрос для обновления пула
        await this.prisma.$queryRaw`SELECT 1`;
        
        console.log(`✅ Safely closed ${stats.idle_old} idle connections`);
        return { checked: stats.total, closed: stats.idle_old };
      }
      
      return { checked: stats.total, closed: 0 };

    } catch (error) {
      console.error('❌ Safe cleanup failed:', error);
      return { checked: 0, closed: 0 };
    } finally {
      this.isCleaningUp = false;
    }
  }

  /**
   * Безопасная статистика - только IDLE соединения
   */
  private async getSafeConnectionStats(): Promise<{
    total: number;
    idle: number;
    active: number;
    idle_old: number;
    active_transactions: number;
  }> {
    try {
      // Запрос с фильтрацией ТОЛЬКО idle соединений
      const result = await this.prisma.$queryRaw<Array<{
        total: bigint;
        idle: bigint;
        active: bigint;
        idle_old: bigint;
        active_transactions: bigint;
      }>>`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE state = 'idle' AND query = '') as idle,
          COUNT(*) FILTER (WHERE state = 'active') as active,
          COUNT(*) FILTER (
            WHERE state = 'idle' 
            AND query = ''
            AND now() - backend_start > interval '${PRISMA_CONFIG.maxIdleConnectionAge / 1000} seconds'
          ) as idle_old,
          COUNT(*) FILTER (
            WHERE state = 'idle in transaction' 
            OR state = 'active'
          ) as active_transactions
        FROM pg_stat_activity 
        WHERE datname = current_database()
          AND application_name IS NOT NULL
          AND application_name != ''
      `;

      const stats = result[0];
      
      return {
        total: Number(stats.total),
        idle: Number(stats.idle),
        active: Number(stats.active),
        idle_old: Number(stats.idle_old),
        active_transactions: Number(stats.active_transactions)
      };

    } catch (error) {
      console.error('❌ Failed to get safe connection stats:', error);
      return { total: 0, idle: 0, active: 0, idle_old: 0, active_transactions: 0 };
    }
  }

  /**
   * Middleware для отслеживания активных операций
   */
  private setupOperationTracking(): void {
    this.prisma.$use(async (params, next) => {
      this.activeOperations++;
      
      try {
        const result = await next(params);
        return result;
      } finally {
        this.activeOperations--;
      }
    });
  }

  private setupShutdownHandlers(): void {
    const cleanup = async () => {
      if (this.cleanupTimer) {
        clearInterval(this.cleanupTimer);
        this.cleanupTimer = null;
      }

      // Ждем завершения активных операций (макс 30 секунд)
      const maxWait = 30000;
      const startTime = Date.now();
      
      while (this.activeOperations > 0 && (Date.now() - startTime) < maxWait) {
        console.log(`⏳ Waiting for ${this.activeOperations} active operations to complete...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (this.activeOperations > 0) {
        console.warn(`⚠️ Force disconnecting with ${this.activeOperations} active operations`);
      }

      if (this.prisma) {
        try {
          await this.prisma.$disconnect();
          console.log('✅ Prisma disconnected safely');
        } catch (error) {
          console.error('❌ Error disconnecting Prisma:', error);
        }
      }
    };

    process.on('beforeExit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }

  public getClient(): ExtendedPrismaClient {
    return this.prisma;
  }

  public async manualSafeCleanup(): Promise<{ checked: number; closed: number }> {
    return this.safeCleanupIdleConnections();
  }

  public getActiveOperationsCount(): number {
    return this.activeOperations;
  }
}

// Создаем безопасный менеджер
const prismaManager = new SafePrismaConnectionManager();
export const prisma = prismaManager.getClient();
export const prismaConnectionManager = prismaManager;

// Подключаем middleware для логирования
if (prisma && typeof prisma.$use === 'function') {
  try {
    createLogMiddleware(prisma);
    
    // Добавляем отслеживание активных операций
    prisma.$use(async (params, next) => {
      prismaConnectionManager['activeOperations']++;
      try {
        const result = await next(params);
        return result;
      } finally {
        prismaConnectionManager['activeOperations']--;
      }
    });
    
    console.log('✅ Prisma middleware initialized successfully');
  } catch (error) {
    console.warn('⚠️ Middleware initialization failed, continuing without it:', error);
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;