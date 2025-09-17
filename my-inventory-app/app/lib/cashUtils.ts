// app/lib/cashUtils.ts
import prisma from './prisma';

export async function getTodayCashDay() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.cashDay.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        isClosed: false
      }
    });
  } catch (error) {
    console.error('Error getting today cash day:', error);
    throw new Error('Failed to get today cash day');
  }
}

export async function ensureTodayCashDay() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Атомарная операция: найти или создать
    const cashDay = await prisma.cashDay.upsert({
      where: {
        date: today,
        isClosed: false
      },
      update: {}, // Если нашли - ничего не обновляем
      create: {
        date: today
        // isClosed и total проставятся автоматически из схемы
      }
    });

    return cashDay;
  } catch (error) {
    console.error('Error ensuring today cash day:', error);
    throw new Error('Failed to ensure today cash day');
  }
}