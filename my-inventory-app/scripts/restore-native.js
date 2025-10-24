const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function restoreBackup(backupFile) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 Restoring backup to:', dbUrl);
    
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
    const backupPath = path.join(backupDir, backupFile);

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    console.log('📄 Restoring from:', backupFile);

    // Устанавливаем пароль
    process.env.PGPASSWORD = password;

    // Команда psql для восстановления
    const psqlPath = 'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe';
    const command = `"${psqlPath}" -h ${host} -p ${port} -U ${user} -d ${database} -f "${backupPath}"`;

    console.log('🔄 Restoring backup...');
    execSync(command, { stdio: 'inherit' });

    console.log('✅ Backup restored successfully:', backupFile);
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node scripts/restore-native.js <backup-file>');
    console.error('Available backups:');
    
    const backupDir = path.join(process.cwd(), 'backups');
    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
      files.forEach(f => console.log('  -', f));
    }
    
    process.exit(1);
  }
  restoreBackup(backupFile).catch(console.error);
}

module.exports = { restoreBackup };