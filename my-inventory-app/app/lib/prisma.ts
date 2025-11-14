// @/app/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { createLogMiddleware } from './prismaLogMiddleware';

interface ExtendedPrismaClient extends PrismaClient {
  _connectionManager?: {
    getStats: () => Promise<ConnectionStats>;
    manualCleanup: (opts?: { aggressive?: boolean }) => Promise<CleanupResult>;
    getActiveOperations: () => number;
  };
}

interface ConnectionStats {
  total: number;
  idle: number;
  active: number;
  idleOld: number;
  idleInTransaction: number;
  activeTransactions: number;
}

interface CleanupResult {
  checked: number;
  closed: number;
  skippedActive: number;
  terminated?: number;
}

const globalForPrisma = global as unknown as {
  prisma?: ExtendedPrismaClient;
  connectionManager?: ConnectionManager;
};

class ConnectionManager {
  private static instance: ConnectionManager;
  private prisma: ExtendedPrismaClient;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private activeOperations = new Set<string>();
  private operationId = 0;
  private isMiddlewareSetup = false;
  private cleanupInProgress = false;
  private shutdownHandlersRegistered = false;

  private constructor() {
    this.prisma = this.createPrismaClient();
    this.setupConnectionTracking();
    this.startBackgroundCleanup();
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  private createPrismaClient(): ExtendedPrismaClient {
    if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
      return globalForPrisma.prisma;
    }

    const prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    }) as ExtendedPrismaClient;

    // ПОДКЛЮЧАЕМ LOG MIDDLEWARE СРАЗУ ПОСЛЕ СОЗДАНИЯ КЛИЕНТА
    // try {
    //   prisma.$use(createLogMiddleware());
    // } catch (error) {
    //   console.warn("⚠️ Failed to setup log middleware:", error);
    // }

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
    }

    return prisma;
  }

  private setupConnectionTracking(): void {
    if (this.isMiddlewareSetup) return;

    if (typeof this.prisma.$use !== "function") {
      if (process.env.NODE_ENV === "development") {
        console.warn("ℹ️ Prisma middleware ($use) not available in this environment");
      }
      return;
    }

    try {
      this.prisma.$use(async (params, next) => {
        const opId = `op_${++this.operationId}_${params.model || "raw"}_${params.action}`;
        this.activeOperations.add(opId);

        try {
          return await next(params);
        } finally {
          this.activeOperations.delete(opId);
        }
      });

      this.isMiddlewareSetup = true;
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Prisma connection tracking enabled");
      }
    } catch (err) {
      console.warn("⚠️ Prisma middleware setup failed:", err);
    }
  }

  private startBackgroundCleanup(): void {
    const enable = process.env.NODE_ENV === "production" || process.env.ENABLE_CONNECTION_CLEANUP === "true";

    if (!enable) {
      if (process.env.NODE_ENV === "development") {
        console.log("ℹ️ Background connection cleanup disabled");
      }
      return;
    }

    const intervalMs = Number(process.env.CONNECTION_CLEANUP_INTERVAL_MS) || 5 * 60 * 1000;

    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      this.safeCleanup().catch((e) => {
        if (process.env.NODE_ENV === "development") {
          console.error("❌ Background safeCleanup failed:", e);
        }
      });
    }, intervalMs);

    if (!this.shutdownHandlersRegistered) {
      const cleanupHandler = async () => {
        await this.cleanup();
      };
      process.once("beforeExit", cleanupHandler);
      process.once("SIGINT", cleanupHandler);
      process.once("SIGTERM", cleanupHandler);
      this.shutdownHandlersRegistered = true;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Background connection cleanup enabled (every ${intervalMs} ms)`);
    }
  }

  public async safeCleanup(opts?: { aggressive?: boolean }): Promise<CleanupResult> {
    if (this.cleanupInProgress) {
      if (process.env.NODE_ENV === "development") {
        console.log("ℹ️ Cleanup already in progress, skipping concurrent run");
      }
      return { checked: 0, closed: 0, skippedActive: 0 };
    }

    this.cleanupInProgress = true;
    try {
      if (this.isMiddlewareSetup && this.activeOperations.size > 0) {
        if (process.env.NODE_ENV === "development") {
          console.log(`⏸️ Skip cleanup - ${this.activeOperations.size} active operations`);
        }
        return { checked: 0, closed: 0, skippedActive: this.activeOperations.size };
      }

      const stats = await this.getConnectionStats();

      if (stats.idleOld <= 0) {
        return { checked: stats.total, closed: 0, skippedActive: 0 };
      }

      if (opts?.aggressive && process.env.ENABLE_CONNECTION_TERMINATION === "true") {
        const terminated = await this.terminateOldIdleConnections();
        return {
          checked: stats.total,
          closed: stats.idleOld,
          skippedActive: stats.active + stats.activeTransactions,
          terminated
        };
      }

      try {
        await this.executeSilentQuery<number>("SELECT 1");
      } catch (e) {
        // игнорируем ошибки тёплого запроса
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 Safe cleanup: ${stats.idleOld} old idle connections (not terminated)`);
      }

      return { checked: stats.total, closed: 0, skippedActive: stats.active + stats.activeTransactions };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Safe cleanup failed:", error);
      }
      return { checked: 0, closed: 0, skippedActive: 0 };
    } finally {
      this.cleanupInProgress = false;
    }
  }

  private async terminateOldIdleConnections(): Promise<number> {
    if (process.env.ENABLE_CONNECTION_TERMINATION !== "true") {
      if (process.env.NODE_ENV === "development") {
        console.log("ℹ️ Aggressive termination is disabled by env");
      }
      return 0;
    }

    try {
      const rows = await this.executeSilentQuery<
        Array<{ pid: number; state: string; query: string; age_seconds: number }>
      >(
        `
        SELECT pid,
               state,
               query,
               EXTRACT(EPOCH FROM (now() - backend_start))::int as age_seconds
        FROM pg_stat_activity
        WHERE datname = current_database()
          AND application_name IS NOT NULL
          AND application_name != ''
          AND state = 'idle'
          AND now() - backend_start > interval '30 minutes'
        `
      );

      if (!rows || rows.length === 0) {
        return 0;
      }

      let terminated = 0;
      for (const r of rows) {
        try {
          await this.executeSilentQuery<number>(`SELECT pg_terminate_backend($1)`, r.pid);
          terminated++;
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`⚠️ Failed to terminate pid ${r.pid}:`, e);
          }
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`🔨 Aggressive cleanup terminated ${terminated} connections`);
      }

      return terminated;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ terminateOldIdleConnections failed:", err);
      }
      return 0;
    }
  }

  private async getConnectionStats(): Promise<ConnectionStats> {
    try {
      const result = await this.executeSilentQuery<
        Array<{
          total: bigint;
          idle: bigint;
          active: bigint;
          idle_old: bigint;
          idle_in_transaction: bigint;
          active_transactions: bigint;
        }>
      >(
        `
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE state = 'idle' AND query = '') as idle,
          COUNT(*) FILTER (WHERE state = 'active') as active,
          COUNT(*) FILTER (
            WHERE state = 'idle' 
            AND query = ''
            AND now() - backend_start > interval '30 minutes'
          ) as idle_old,
          COUNT(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction,
          COUNT(*) FILTER (
            WHERE state = 'active' 
            AND query LIKE 'BEGIN%'
          ) as active_transactions
        FROM pg_stat_activity 
        WHERE datname = current_database()
          AND application_name IS NOT NULL
          AND application_name != ''
        `
      );

      const stats = result[0] || ({} as any);

      return {
        total: Number(stats.total || 0),
        idle: Number(stats.idle || 0),
        active: Number(stats.active || 0),
        idleOld: Number(stats.idle_old || 0),
        idleInTransaction: Number(stats.idle_in_transaction || 0),
        activeTransactions: Number(stats.active_transactions || 0)
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Failed to get connection stats:", error);
      }
      return { total: 0, idle: 0, active: 0, idleOld: 0, idleInTransaction: 0, activeTransactions: 0 };
    }
  }

  private async executeSilentQuery<T>(query: string, ...params: any[]): Promise<any> {
    if (params && params.length > 0) {
      return this.prisma.$queryRawUnsafe<T>(query, ...params);
    }
    return this.prisma.$queryRaw<T>(query);
  }

  public async manualCleanup(opts?: { aggressive?: boolean }): Promise<CleanupResult> {
    return this.safeCleanup(opts);
  }

  public async getStats(): Promise<ConnectionStats> {
    return this.getConnectionStats();
  }

  public getActiveOperations(): number {
    return this.isMiddlewareSetup ? this.activeOperations.size : 0;
  }

  private async cleanup(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    const maxWait = Number(process.env.CONNECTION_SHUTDOWN_WAIT_MS) || 10000;
    const start = Date.now();
    while (this.activeOperations.size > 0 && Date.now() - start < maxWait) {
      await new Promise((r) => setTimeout(r, 100));
    }

    if (this.activeOperations.size > 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`⚠️ Force disconnect with ${this.activeOperations.size} active operations`);
      }
    }

    try {
      await this.prisma.$disconnect();
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Prisma disconnected successfully");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Error disconnecting Prisma:", err);
      }
    }
  }

  public getClient(): ExtendedPrismaClient {
    return this.prisma;
  }
}

let connectionManager: ConnectionManager;
if (globalForPrisma.connectionManager) {
  connectionManager = globalForPrisma.connectionManager;
} else {
  connectionManager = ConnectionManager.getInstance();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.connectionManager = connectionManager;
  }
}

const prisma = connectionManager.getClient();
prisma._connectionManager = {
  getStats: () => connectionManager.getStats(),
  manualCleanup: (opts?: { aggressive?: boolean }) => connectionManager.manualCleanup(opts),
  getActiveOperations: () => connectionManager.getActiveOperations()
};

export { prisma };
export default prisma;

export const connectionUtils = {
  getStats: async (): Promise<ConnectionStats> => {
    if (prisma._connectionManager) {
      return prisma._connectionManager.getStats();
    }
    return { total: 0, idle: 0, active: 0, idleOld: 0, idleInTransaction: 0, activeTransactions: 0 };
  },

  manualCleanup: async (opts?: { aggressive?: boolean }): Promise<CleanupResult> => {
    if (prisma._connectionManager) {
      return prisma._connectionManager.manualCleanup(opts);
    }
    return { checked: 0, closed: 0, skippedActive: 0 };
  },

  getActiveOperations: (): number => {
    if (prisma._connectionManager) {
      return prisma._connectionManager.getActiveOperations();
    }
    return 0;
  }
};