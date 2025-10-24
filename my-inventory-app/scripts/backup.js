const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Загружаем .env файл
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const execAsync = promisify(exec);

async function backupDatabase() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 DATABASE_URL:', dbUrl ? 'found' : 'not found');
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables. Check your .env file');
    }

    // Парсим URL БД
    const url = new URL(dbUrl);
    const dbName = url.pathname.slice(1);
    const dbUser = url.username;
    const dbHost = url.hostname;
    const dbPort = url.port || '5432';
    const dbPassword = url.password;

    console.log('📊 Database info:', { dbHost, dbPort, dbName, dbUser });

    // Создаем директории
    const backupDir = path.join(process.cwd(), 'backups');
    const tempDir = path.join(backupDir, 'temp');
    
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sqlFilename = `backup-${timestamp}.sql`;
    const zipFilename = `backup-${timestamp}.zip`;
    
    const sqlPath = path.join(tempDir, sqlFilename);
    const zipPath = path.join(backupDir, zipFilename);

    console.log('🔍 Creating database backup...');

    // Команда pg_dump с переменной окружения
    const env = { ...process.env, PGPASSWORD: dbPassword };
    const dumpCommand = `pg_dump --host=${dbHost} --port=${dbPort} --username=${dbUser} --dbname=${dbName} --file="${sqlPath}" --verbose`;

    console.log('💻 Executing:', dumpCommand);
    
    await execAsync(dumpCommand, { env });
    console.log('✅ SQL dump created');

    // Архивируем SQL файл
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`✅ Archive created: ${zipPath} (${archive.pointer()} bytes)`);
        resolve();
      });

      archive.on('error', reject);
      archive.pipe(output);
      archive.file(sqlPath, { name: sqlFilename });
      archive.finalize();
    });

    // Удаляем временный SQL файл
    fs.unlinkSync(sqlPath);
    fs.rmdirSync(tempDir);

    console.log(`🎉 Backup completed: ${zipFilename}`);
    return zipFilename;

  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
  backupDatabase().catch(console.error);
}

module.exports = { backupDatabase };