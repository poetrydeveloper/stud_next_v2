const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Загружаем .env файл
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function backupDatabase() {
  let client;
  try {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🔍 DATABASE_URL:', dbUrl ? 'found' : 'not found');
    
    if (!dbUrl) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    client = new Client({
      connectionString: dbUrl
    });

    await client.connect();
    console.log('✅ Connected to database');

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

    // Получаем все таблицы
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('📊 Tables found:', tables);

    let sqlContent = `-- Database Backup\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
    sqlContent += `-- Database: ${dbUrl.split('/').pop()}\n\n`;

    // Для каждой таблицы получаем данные
    for (const table of tables) {
      console.log(`📋 Backing up table: ${table}`);
      
      // Получаем структуру таблицы
      const structureResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [table]);

      // Получаем данные таблицы
      const dataResult = await client.query(`SELECT * FROM "${table}"`);
      
      // Генерируем SQL для вставки данных
      if (dataResult.rows.length > 0) {
        sqlContent += `\n-- Table: ${table}\n`;
        sqlContent += `INSERT INTO "${table}" (`;
        sqlContent += structureResult.rows.map(col => `"${col.column_name}"`).join(', ');
        sqlContent += ') VALUES\n';
        
        const values = dataResult.rows.map(row => {
          const rowValues = structureResult.rows.map(col => {
            const value = row[col.column_name];
            if (value === null) return 'NULL';
            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
            if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
            if (value instanceof Date) return `'${value.toISOString()}'`;
            return value;
          });
          return `  (${rowValues.join(', ')})`;
        });
        
        sqlContent += values.join(',\n');
        sqlContent += ';\n';
      }
    }

    // Сохраняем SQL файл
    fs.writeFileSync(sqlPath, sqlContent);
    console.log('✅ SQL content generated');

    // Архивируем
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

    // Очищаем временные файлы
    fs.unlinkSync(sqlPath);
    fs.rmdirSync(tempDir);

    console.log(`🎉 Backup completed: ${zipFilename}`);
    return zipFilename;

  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// Запуск если файл вызван напрямую
if (require.main === module) {
  backupDatabase().catch(console.error);
}

module.exports = { backupDatabase };