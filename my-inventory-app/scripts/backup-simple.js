const { dump } = require('pg-dump');
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

    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.sql`;
    const backupPath = path.join(backupDir, backupFile);

    // Создаем бэкап с явной кодировкой
    await dump({
      connectionString: dbUrl,
      output: backupPath,
      encoding: 'utf8',  // Явно указываем UTF-8
      verbose: true
    });

    console.log('✅ Backup created:', backupFile);
    
    // Проверим что файл создался и есть русский текст
    const content = fs.readFileSync(backupPath, 'utf8');
    const hasRussian = /[а-яА-Я]/.test(content);
    console.log('🔤 Russian text in backup:', hasRussian ? '✅ YES' : '❌ NO');
    
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