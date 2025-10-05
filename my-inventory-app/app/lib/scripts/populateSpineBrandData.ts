// app/lib/scripts/populateSpineBrandData.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function populateSpineBrandData() {
  console.log('🔄 Начинаем заполнение brandData для Spine...');
  
  try {
    const spines = await prisma.spine.findMany({
      include: {
        productUnits: {
          include: {
            product: {
              include: {
                brand: true,
                images: true
              }
            }
          }
        }
      }
    });

    let updatedCount = 0;
    let errorCount = 0;

    for (const spine of spines) {
      try {
        const brandData: any = {};
        
        // Собираем данные из существующих units
        for (const unit of spine.productUnits) {
          const brandName = unit.product.brand?.name || "Без бренда";
          
          if (!brandData[brandName]) {
            brandData[brandName] = {
              displayName: unit.productName || unit.product.name,
              imagePath: unit.product.images[0]?.path || spine.imagePath,
              productCode: unit.productCode || unit.product.code,
              updatedAt: new Date().toISOString()
            };
          }
        }

        // Обновляем spine только если есть данные
        if (Object.keys(brandData).length > 0) {
          await prisma.spine.update({
            where: { id: spine.id },
            data: { brandData }
          });
          updatedCount++;
          console.log(`✅ Spine "${spine.name}" - ${Object.keys(brandData).length} брендов`);
        } else {
          console.log(`➖ Spine "${spine.name}" - нет units для брендов`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Ошибка у spine ${spine.name}:`, error);
      }
    }

    console.log('\n🎉 Заполнение завершено!');
    console.log(`✅ Обновлено: ${updatedCount} spine`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log(`📊 Всего обработано: ${spines.length} spine`);

  } catch (error) {
    console.error('💥 Критическая ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Если скрипт запускается напрямую
if (require.main === module) {
  populateSpineBrandData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}