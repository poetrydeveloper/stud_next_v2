// app/lib/serialGenerator.ts
import { v4 as uuidv4 } from 'uuid';

interface GenerateSerialParams {
  productCode: string;
  deliveryPrice: string;
  timestamp?: Date;
}

export function generateSerialNumber({ 
  productCode, 
  deliveryPrice, 
  timestamp = new Date() 
}: GenerateSerialParams): string {
  // Форматируем данные
  const basePrefix = `${productCode}_${deliveryPrice}-`;
  const datePart = timestamp
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 12); // YYYYMMDDHHMMSS
  const uniquePart = uuidv4().hex.slice(0, 8);

  return `${basePrefix}${datePart}-${uniquePart}`;
}