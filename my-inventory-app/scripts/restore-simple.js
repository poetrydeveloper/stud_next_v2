const { restore } = require('pg-dump');
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

    const backupDir = path.join(process.cwd(), 'backups');
    const backupPath = path.join(backupDir, backupFile);

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    console.log('📄 Restoring from:', backupFile);

    // Проверим кодировку файла
    const content = fs.readFileSync(backupPath, 'utf8');
    const hasRussian = /[а-яА-Я]/.test(content);
    console.log('🔤 Russian text in backup file:', hasRussian ? '✅ YES' : '❌ NO');

    // Восстанавливаем с явной кодировкой
    await restore({
      connectionString: dbUrl,
      input: backupPath,
      encoding: 'utf8',  // Явно указываем UTF-8
      verbose: true
    });

    console.log('✅ Backup restored successfully:', backupFile);
    
    // Проверим что русский текст восстановился
    const { Client } = require('pg');
    const client = new Client({ connectionString: dbUrl });
    await client.connect();
    
    const result = await client.query('SELECT name FROM categories WHERE name ~ \'[а-яА-Я]\' LIMIT 3');
    console.log('🔤 Russian categories in database:', result.rows.length > 0 ? '✅ YES' : '❌ NO');
    result.rows.forEach(row => console.log('   -', row.name));
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node restore-simple.js <backup-file>');
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