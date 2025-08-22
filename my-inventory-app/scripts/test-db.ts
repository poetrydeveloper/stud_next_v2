import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // простой запрос к Postgres (например, получим список базовых схем)
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Подключение к БД успешно:', result)
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
