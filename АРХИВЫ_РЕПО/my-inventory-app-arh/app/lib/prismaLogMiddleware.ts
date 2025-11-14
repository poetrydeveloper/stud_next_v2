// app/lib/prismaLogMiddleware.ts
import { Prisma } from '@prisma/client';

export function createLogMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
    
    return result;
  };
}