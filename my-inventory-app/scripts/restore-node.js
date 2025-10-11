const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

// Загружаем .env файл
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function restoreDatabase(backupFile) {
  let client;
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 DATABASE_URL:', dbUrl ? 'found' : 'not found');
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

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
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());

    // Подключаемся к БД
    client = new Client({
      connectionString: dbUrl
    });
    await client.connect();
    console.log('✅ Connected to database');

    // Выполняем SQL statements
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (stmt && !stmt.startsWith('--')) {
        try {
          await client.query(stmt);
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
        }
      }
    }

    console.log('✅ Database restored successfully');

    // Очищаем временные файлы
    fs.unlinkSync(sqlPath);
    fs.rmdirSync(tempDir);

    console.log('🎉 Database restoration completed');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
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