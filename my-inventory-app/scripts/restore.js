const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

// Загружаем .env файл
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const execAsync = promisify(exec);

async function restoreDatabase(backupFile) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 DATABASE_URL:', dbUrl ? 'found' : 'not found');
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    // Парсим URL БД
    const url = new URL(dbUrl);
    const dbName = url.pathname.slice(1);
    const dbUser = url.username;
    const dbHost = url.hostname;
    const dbPort = url.port || '5432';
    const dbPassword = url.password;

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

    // Восстанавливаем БД
    const env = { ...process.env, PGPASSWORD: dbPassword };
    const restoreCommand = `psql --host=${dbHost} --port=${dbPort} --username=${dbUser} --dbname=${dbName} --file="${sqlPath}"`;

    console.log('💻 Executing:', restoreCommand);
    await execAsync(restoreCommand, { env });
    console.log('✅ Database restored successfully');

    // Очищаем временные файлы
    fs.unlinkSync(sqlPath);
    fs.rmdirSync(tempDir);

    console.log('🎉 Database restoration completed');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node restore.js <backup-file>');
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