const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function createBackup() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 Creating backup from:', dbUrl);
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found');
    }

    // Парсим DATABASE_URL
    const url = new URL(dbUrl.replace('postgresql://', 'http://'));
    const user = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = url.port || 5432;
    const database = url.pathname.substring(1);

    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.sql`;
    const backupPath = path.join(backupDir, backupFile);

    // Устанавливаем пароль
    process.env.PGPASSWORD = password;

    // Команда pg_dump
    const pgDumpPath = 'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe';
    const command = `"${pgDumpPath}" -h ${host} -p ${port} -U ${user} -d ${database} -f "${backupPath}" --encoding=utf8`;

    console.log('📦 Creating backup...');
    execSync(command, { stdio: 'inherit' });

    console.log('✅ Backup created:', backupFile);
    
    // Проверим что файл создался
    if (fs.existsSync(backupPath)) {
      const stats = fs.statSync(backupPath);
      console.log('📊 Backup size:', (stats.size / 1024).toFixed(2), 'KB');
      
      // Проверим русский текст
      const content = fs.readFileSync(backupPath, 'utf8');
      const hasRussian = /[а-яА-Я]/.test(content);
      console.log('🔤 Russian text in backup:', hasRussian ? '✅ YES' : '❌ NO');
    }

    // Покажем список бэкапов
    const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
    console.log('📂 Available backups:', backups);

    return backupFile;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

if (require.main === module) {
  createBackup().catch(console.error);
}

module.exports = { createBackup };