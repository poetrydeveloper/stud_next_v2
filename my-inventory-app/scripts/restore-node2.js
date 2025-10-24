// scripts/restore-node2.js
const { Client } = require('pg');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function restoreDatabase(backupFile) {
  let client;
  let prisma;
  const errors = [];
  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    tables: {}
  };

  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 DATABASE_URL:', dbUrl ? 'found' : 'not found');
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    // Инициализируем Prisma
    prisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: { db: { url: dbUrl } }
    });
    await prisma.$connect();
    console.log('✅ Prisma connected');

    const backupPath = path.join(process.cwd(), 'backups', backupFile);
    const tempDir = path.join(process.cwd(), 'backups', 'temp_restore');

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    console.log('🔍 Restoring database from:', backupFile);

    // Создаем временную директорию
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // Разархивируем
    console.log('📦 Extracting archive...');
    await new Promise((resolve, reject) => {
      fs.createReadStream(backupPath)
        .pipe(unzipper.Extract({ path: tempDir }))
        .on('close', resolve)
        .on('error', reject);
    });

    // Находим SQL файл
    const files = fs.readdirSync(tempDir);
    const sqlFile = files.find(f => f.endsWith('.sql'));
    
    if (!sqlFile) {
      throw new Error('SQL file not found in archive');
    }

    const sqlPath = path.join(tempDir, sqlFile);
    console.log('📄 Found SQL file:', sqlFile);

    // Читаем SQL файл
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Улучшенный парсинг SQL
    const statements = [];
    let currentStatement = '';
    let inParentheses = 0;
    
    for (let i = 0; i < sqlContent.length; i++) {
      const char = sqlContent[i];
      const nextChar = sqlContent[i + 1];
      
      if (char === '(') inParentheses++;
      if (char === ')') inParentheses--;
      
      currentStatement += char;
      
      if (char === ';' && inParentheses === 0) {
        const trimmed = currentStatement.trim();
        if (trimmed && !trimmed.startsWith('--')) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }

    stats.total = statements.length;
    console.log(`📊 Found ${statements.length} SQL statements`);

    // Подключаемся к БД
    client = new Client({
      connectionString: dbUrl
    });
    await client.connect();
    console.log('✅ Connected to database');

    // Временно отключаем триггеры и ограничения
    await client.query('SET session_replication_role = "replica";');

    // Выполняем SQL statements
    console.log('🚀 Executing SQL statements...');
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      // Определяем таблицу из INSERT statement
      const tableMatch = stmt.match(/INSERT INTO "([^"]+)"/i);
      const tableName = tableMatch ? tableMatch[1] : 'unknown';
      
      if (!stats.tables[tableName]) {
        stats.tables[tableName] = { success: 0, failed: 0 };
      }
      
      try {
        await client.query(stmt);
        stats.success++;
        stats.tables[tableName].success++;
        
        if (stats.success % 20 === 0) {
          console.log(`✅ Progress: ${stats.success}/${statements.length} statements`);
        }
      } catch (error) {
        stats.failed++;
        stats.tables[tableName].failed++;
        errors.push({
          statement: i + 1,
          table: tableName,
          error: error.message,
          sql: stmt.substring(0, 200) + '...' // первые 200 символов
        });
        
        console.warn(`❌ Error in statement ${i + 1} (table: ${tableName}):`, error.message);
      }
    }

    // Включаем обратно ограничения
    await client.query('SET session_replication_role = "origin";');

    console.log('\n📊 RESTORATION SUMMARY:');
    console.log(`✅ Successful: ${stats.success}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`📋 Total: ${stats.total}`);
    
    console.log('\n📈 TABLE STATISTICS:');
    Object.entries(stats.tables).forEach(([table, tableStats]) => {
      console.log(`  ${table}: ✅ ${tableStats.success} ❌ ${tableStats.failed}`);
    });

    // Проверяем данные через Prisma
    console.log('\n🔍 VERIFYING DATA THROUGH PRISMA...');
    await verifyDataWithPrisma(prisma, stats);

    if (errors.length > 0) {
      console.log('\n❌ ERRORS DETAILS:');
      errors.slice(0, 10).forEach(err => { // Показываем первые 10 ошибок
        console.log(`  Statement ${err.statement} (${err.table}): ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more errors`);
      }
      
      // Сохраняем полный лог ошибок в файл
      const errorLogPath = path.join(process.cwd(), 'backups', `restore-errors-${Date.now()}.json`);
      fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
      console.log(`📄 Full error log saved to: ${errorLogPath}`);
    }

    // Очищаем временные файлы
    fs.unlinkSync(sqlPath);
    fs.rmdirSync(tempDir);

    console.log('\n🎉 Database restoration completed');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Функция проверки данных через Prisma
async function verifyDataWithPrisma(prisma, stats) {
  try {
    console.log('🔍 Checking data integrity...');
    
    // Проверяем основные таблицы
    const tablesToCheck = [
      { name: 'products', model: prisma.product },
      { name: 'categories', model: prisma.category },
      { name: 'brands', model: prisma.brand },
      { name: 'product_units', model: prisma.productUnit },
      { name: 'cash_days', model: prisma.cashDay }
    ];

    for (const table of tablesToCheck) {
      try {
        const count = await table.model.count();
        console.log(`  📊 ${table.name}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${table.name}: Error - ${error.message}`);
      }
    }

    // Проверяем связи между таблицами
    console.log('\n🔗 Checking relationships...');
    
    try {
      const productsWithCategory = await prisma.product.findMany({
        take: 5,
        include: { category: true }
      });
      console.log(`  ✅ Products with categories: ${productsWithCategory.length} sampled`);
    } catch (error) {
      console.log(`  ❌ Products-categories relationship: ${error.message}`);
    }

    try {
      const productUnitsWithProduct = await prisma.productUnit.findMany({
        take: 5,
        include: { product: true }
      });
      console.log(`  ✅ ProductUnits with products: ${productUnitsWithProduct.length} sampled`);
    } catch (error) {
      console.log(`  ❌ ProductUnits-products relationship: ${error.message}`);
    }

  } catch (error) {
    console.log('❌ Error during data verification:', error.message);
  }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node restore-node.js <backup-file>');
    console.error('Available backups:');
    
    const backupDir = path.join(process.cwd(), 'backups');
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.zip'));
      files.forEach(f => console.log('  -', f));
    }
    
    process.exit(1);
  }
  restoreDatabase(backupFile).catch(console.error);
}

module.exports = { restoreDatabase };
