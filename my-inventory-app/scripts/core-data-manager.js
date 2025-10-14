// scripts/core-data-manager.js
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();
const CORE_DIR = path.join(process.cwd(), 'core-data');

// Таблицы которые входят в ядро
const CORE_TABLES = [
  'Supplier',
  'Customer', 
  'User',
  'Category',
  'Brand',
  'Spine',
  'Product',
  'ProductImage'
];

class CoreDataManager {
  // Экспорт ядра данных
  async exportCoreData(backupName = 'core-backup') {
    try {
      if (!fs.existsSync(CORE_DIR)) {
        fs.mkdirSync(CORE_DIR, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const exportFile = `${backupName}-${timestamp}.json`;
      const exportPath = path.join(CORE_DIR, exportFile);

      console.log('📦 Экспортируем ядро данных...');

      const coreData = {};

      // Экспортируем каждую таблицу
      for (const table of CORE_TABLES) {
        console.log(`  📊 Экспортируем ${table}...`);
        
        try {
          const includeConfig = this.getIncludes(table);
          const data = await prisma[table.toLowerCase()].findMany({
            include: includeConfig
          });
          
          coreData[table] = data;
          console.log(`  ✅ ${table}: ${data.length} записей`);
        } catch (error) {
          console.log(`  ⚠️  ${table}: ошибка - ${error.message}`);
        }
      }

      // Сохраняем в файл
      fs.writeFileSync(exportPath, JSON.stringify(coreData, null, 2), 'utf8');
      
      console.log('✅ Ядро данных экспортировано!');
      console.log(`📁 Файл: ${exportFile}`);
      
      return exportFile;
      
    } catch (error) {
      console.error('❌ Ошибка экспорта:', error);
      throw error;
    }
  }

  // Импорт ядра данных
  async importCoreData(importFile, options = { clearExisting: false }) {
    try {
      const importPath = path.join(CORE_DIR, importFile);
      
      if (!fs.existsSync(importPath)) {
        throw new Error(`Файл импорта не найден: ${importFile}`);
      }

      console.log('🔄 Импортируем ядро данных...');
      
      const coreData = JSON.parse(fs.readFileSync(importPath, 'utf8'));
      
      // Очищаем существующие данные если нужно
      if (options.clearExisting) {
        console.log('🗑️  Очищаем существующие данные...');
        await this.clearCoreData();
      }

      // Импортируем данные в правильном порядке (с учетом зависимостей)
      const importOrder = ['Supplier', 'Brand', 'Category', 'User', 'Customer', 'Spine', 'Product', 'ProductImage'];
      
      for (const table of importOrder) {
        if (coreData[table] && coreData[table].length > 0) {
          console.log(`  📥 Импортируем ${table}...`);
          
          try {
            await this.importTableData(table, coreData[table]);
            console.log(`  ✅ ${table}: импортировано ${coreData[table].length} записей`);
          } catch (error) {
            console.log(`  ❌ ${table}: ошибка импорта - ${error.message}`);
          }
        }
      }

      console.log('✅ Ядро данных импортировано!');
      
    } catch (error) {
      console.error('❌ Ошибка импорта:', error);
      throw error;
    }
  }

  // Очистка ядра данных
  async clearCoreData() {
    try {
      // Очищаем в обратном порядке (из-за foreign keys)
      const clearOrder = ['ProductImage', 'Product', 'Spine', 'Customer', 'User', 'Category', 'Brand', 'Supplier'];
      
      for (const table of clearOrder) {
        console.log(`  🧹 Очищаем ${table}...`);
        await prisma[table.toLowerCase()].deleteMany({});
      }
      
      console.log('✅ Ядро данных очищено!');
    } catch (error) {
      console.error('❌ Ошибка очистки:', error);
      throw error;
    }
  }

  // Получить список файлов ядра
  listCoreFiles() {
    if (!fs.existsSync(CORE_DIR)) return [];
    
    return fs.readdirSync(CORE_DIR)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .map(file => {
        const filePath = path.join(CORE_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: this.formatFileSize(stats.size),
          date: stats.mtime.toLocaleString('ru-RU')
        };
      });
  }

  // Вспомогательные методы
  getIncludes(table) {
    const tableLower = table.toLowerCase();
    
    switch (tableLower) {
      case 'product':
        return {
          category: true,
          brand: true,
          spine: true,
          images: true
        };
      case 'spine':
        return {
          category: true
        };
      case 'productimage':
        return {
          product: true
        };
      default:
        return {};
    }
  }

  async importTableData(tableName, data) {
    const model = tableName.toLowerCase();
    
    for (const item of data) {
      try {
        // Убираем ID чтобы база сама генерировала новые
        const { id, ...cleanData } = item;
        
        await prisma[model].create({
          data: cleanData
        });
      } catch (error) {
        console.log(`    ⚠️  Пропущена запись в ${tableName}: ${error.message}`);
      }
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI интерфейс
async function main() {
  const manager = new CoreDataManager();
  const command = process.argv[2];

  switch (command) {
    case 'export':
      const name = process.argv[3] || 'core-backup';
      await manager.exportCoreData(name);
      break;
      
    case 'import':
      const file = process.argv[3];
      if (!file) {
        console.log('❌ Укажите файл для импорта: npm run core:import <filename>');
        process.exit(1);
      }
      const clear = process.argv[4] === '--clear';
      await manager.importCoreData(file, { clearExisting: clear });
      break;
      
    case 'clear':
      await manager.clearCoreData();
      break;
      
    case 'list':
      const files = manager.listCoreFiles();
      if (files.length === 0) {
        console.log('📂 Файлы ядра не найдены');
      } else {
        console.log('📂 Файлы ядра данных:');
        files.forEach((file, index) => {
          console.log(`  ${index + 1}. ${file.name}`);
          console.log(`     📊 ${file.size} | 📅 ${file.date}`);
        });
      }
      break;
      
    default:
      console.log(`
🎯 МЕНЕДЖЕР ЯДРА ДАННЫХ

Команды:
  npm run core:export [name]    - Экспорт ядра данных
  npm run core:import <file>    - Импорт ядра данных
  npm run core:import <file> --clear - Импорт с очисткой
  npm run core:clear            - Очистить ядро данных
  npm run core:list             - Список файлов ядра

Пример:
  npm run core:export my-store
  npm run core:import my-store-2024-10-14T10-30-00Z.json --clear
      `);
  }
  
  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CoreDataManager;