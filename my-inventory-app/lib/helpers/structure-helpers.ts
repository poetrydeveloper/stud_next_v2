//lib/helpers/structure-helpers.ts
import { generateSlug } from '@/lib/translit';

export class StructureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StructureError';
  }
}

export function validateSlug(slug: string): void {
  if (!slug || slug.length === 0) {
    throw new StructureError('Slug не может быть пустым');
  }
  if (!/^[a-z0-9_-]+$/.test(slug)) {
    throw new StructureError('Slug может содержать только латиницу, цифры, дефисы и подчеркивания');
  }
}

export function generateValidSlug(name: string): string {
  return generateSlug(name);
}