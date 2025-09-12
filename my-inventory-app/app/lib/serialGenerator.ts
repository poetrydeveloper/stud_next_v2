import { v4 as uuidv4 } from "uuid";

interface GenerateSerialParams {
  productCode: string;
  deliveryPrice?: string | number;
  timestamp?: Date;
}

/**
 * Генератор серийных номеров для ProductUnit
 * Формат:
 *   PROD123-20250911-153045-AB12CD34
 *
 * - productCode: код товара
 * - deliveryPrice: опционально добавляется в префикс
 * - timestamp: дата (по умолчанию now)
 */
export function generateSerialNumber({
  productCode,
  deliveryPrice,
  timestamp = new Date(),
}: GenerateSerialParams): string {
  const datePart = timestamp.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const timePart = timestamp.toISOString().slice(11, 19).replace(/:/g, ""); // HHMMSS

  // Убираем дефисы из uuid и берём первые 8 символов
  const uniquePart = uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase();

  const pricePart = deliveryPrice ? `-${deliveryPrice}` : "";

  return `${productCode}${pricePart}-${datePart}-${timePart}-${uniquePart}`;
}
