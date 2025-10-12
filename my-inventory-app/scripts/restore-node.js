// scripts/restore-node.js
const { Client } = require('pg');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const { execSync } = require('child_process');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function restoreDatabase(backupFile) {
  let prisma;
  let client;
  
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 DATABASE_URL:', dbUrl ? 'found' : 'not found');
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    // Подключаемся к БД
    client = new Client({ connectionString: dbUrl });
    await client.connect();
    console.log('✅ Database connected');

    // Инициализируем Prisma
    prisma = new PrismaClient();
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

    // ЧИСТИМ БАЗУ ПЕРЕД ВОССТАНОВЛЕНИЕМ
    console.log('🧹 Cleaning database before restore...');
    await cleanDatabase(client);

    // Используем полный путь к psql
    console.log('🚀 Executing SQL with psql...');
    
    try {
      // Извлекаем данные из DATABASE_URL
      const url = new URL(dbUrl.replace('postgresql://', 'http://'));
      const user = url.username;
      const password = url.password;
      const host = url.hostname;
      const port = url.port || 5432;
      const database = url.pathname.substring(1);

      // Устанавливаем переменную окружения с паролем
      process.env.PGPASSWORD = password;

      // ПОЛНЫЙ ПУТЬ К PSQL
      const psqlPath = 'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe';
      
      // Проверяем что psql существует
      if (!fs.existsSync(psqlPath)) {
        throw new Error(`psql not found at: ${psqlPath}`);
      }

      // ОТКЛЮЧАЕМ FOREIGN KEYS
      console.log('🔓 Disabling foreign key constraints...');
      await client.query('SET session_replication_role = "replica";');

      // Выполняем SQL файл через psql
      const command = `"${psqlPath}" -h ${host} -p ${port} -U ${user} -d ${database} -f "${sqlPath}"`;
      
      console.log('📝 Executing psql command...');
      console.log(`   Database: ${database}@${host}:${port}`);
      console.log(`   User: ${user}`);
      console.log(`   SQL file: ${sqlPath}`);
      
      execSync(command, { 
        stdio: 'inherit',
        encoding: 'utf8'
      });
      
      console.log('✅ SQL executed successfully');

      // ВКЛЮЧАЕМ FOREIGN KEYS ОБРАТНО
      console.log('🔒 Re-enabling foreign key constraints...');
      await client.query('SET session_replication_role = "origin";');

    } catch (error) {
      console.error('❌ Error executing SQL:', error.message);
      // Все равно включаем constraints обратно
      try {
        await client.query('SET session_replication_role = "origin";');
      } catch (e) {
        console.log('⚠️  Could not re-enable constraints:', e.message);
      }
      throw error;
    }

    // Проверяем данные через Prisma
    console.log('\n🔍 VERIFYING DATA THROUGH PRISMA...');
    await verifyDataWithPrisma(prisma);

    // Очищаем временные файлы
    fs.unlinkSync(sqlPath);
    fs.rmdirSync(tempDir);

    console.log('\n🎉 Database restoration completed');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
    if (client) {
      await client.end();
    }
    // Очищаем пароль из env
    delete process.env.PGPASSWORD;
  }
}

// Функция очистки базы данных (кроме миграций)
async function cleanDatabase(client) {
  try {
    // Получаем список всех таблиц (кроме миграций)
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename != '_prisma_migrations'
    `);

    const tables = tablesResult.rows.map(row => row.tablename);
    
    if (tables.length > 0) {
      console.log(`🗑️  Truncating ${tables.length} tables...`);
      
      // Отключаем constraints
      await client.query('SET session_replication_role = "replica";');
      
      // Очищаем таблицы
      for (const table of tables) {
        try {
          await client.query(`TRUNCATE TABLE "${table}" CASCADE`);
          console.log(`   ✅ Cleared: ${table}`);
        } catch (error) {
          console.log(`   ⚠️  Could not clear ${table}: ${error.message}`);
        }
      }
      
      // Включаем constraints обратно
      await client.query('SET session_replication_role = "origin";');
    }
    
    console.log('✅ Database cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning database:', error.message);
    throw error;
  }
}

// Функция проверки данных через Prisma
async function verifyDataWithPrisma(prisma) {
  try {
    console.log('🔍 Checking data integrity...');
    
    const tablesToCheck = [
      { name: 'products', model: prisma.product },
      { name: 'categories', model: prisma.category },
      { name: 'brands', model: prisma.brand },
      { name: 'product_units', model: prisma.productUnit },
      { name: 'cash_days', model: prisma.cashDay },
      { name: 'product_images', model: prisma.productImage },
      { name: 'spines', model: prisma.spine },
      { name: 'cash_events', model: prisma.cashEvent },
      { name: 'product_unit_logs', model: prisma.productUnitLog }
    ];

    for (const table of tablesToCheck) {
      try {
        const count = await table.model.count();
        console.log(`  ${count > 0 ? '✅' : '⚠️ '} ${table.name}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${table.name}: Error - ${error.message}`);
      }
    }

    // Проверяем связи
    console.log('\n🔗 Checking relationships...');
    
    try {
      const sampleProduct = await prisma.product.findFirst({
        include: { 
          category: true,
          brand: true,
          spine: true
        }
      });
      if (sampleProduct) {
        console.log(`  ✅ Sample product: "${sampleProduct.name}"`);
        console.log(`     Category: ${sampleProduct.category?.name}`);
        console.log(`     Brand: ${sampleProduct.brand?.name}`);
        console.log(`     Spine: ${sampleProduct.spine?.name}`);
      } else {
        console.log(`  ❌ No products found - restoration may have failed`);
      }
    } catch (error) {
      console.log(`  ❌ Product relationships: ${error.message}`);
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
    
    const backupDir = path.join(process.cwd(), 'backups');
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.zip'));
      if (files.length > 0) {
        console.error('Available backups:');
        files.forEach(f => console.log('  -', f));
      } else {
        console.error('No backup files found in backups directory');
      }
    }
    
    process.exit(1);
  }
  restoreDatabase(backupFile).catch(console.error);
}

module.exports = { restoreDatabase };