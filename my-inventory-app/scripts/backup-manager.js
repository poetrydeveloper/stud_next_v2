#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Конфигурация
const PSQL_PATH = 'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe';
const PG_DUMP_PATH = 'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe';
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Утилиты
function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function getBackupFiles() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .reverse();
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileInfo(filename) {
  const filePath = path.join(BACKUP_DIR, filename);
  const stats = fs.statSync(filePath);
  return {
    name: filename,
    size: formatFileSize(stats.size),
    date: stats.mtime.toLocaleString('ru-RU')
  };
}

// Основные функции
async function createBackup() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL not found');

    const url = new URL(dbUrl.replace('postgresql://', 'http://'));
    const user = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = url.port || 5432;
    const database = url.pathname.substring(1);

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.sql`;
    const backupPath = path.join(BACKUP_DIR, backupFile);

    process.env.PGPASSWORD = password;
    const command = `"${PG_DUMP_PATH}" -h ${host} -p ${port} -U ${user} -d ${database} -f "${backupPath}" --encoding=utf8`;

    console.log('📦 Создаем бэкап...');
    execSync(command, { stdio: 'inherit' });

    const stats = fs.statSync(backupPath);
    console.log('✅ Бэкап создан успешно!');
    console.log(`📁 Файл: ${backupFile}`);
    console.log(`📊 Размер: ${formatFileSize(stats.size)}`);
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка создания бэкапа:', error.message);
    return false;
  }
}

async function restoreBackup(backupFile) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL not found');

    const url = new URL(dbUrl.replace('postgresql://', 'http://'));
    const user = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = url.port || 5432;
    const database = url.pathname.substring(1);

    const backupPath = path.join(BACKUP_DIR, backupFile);
    if (!fs.existsSync(backupPath)) {
      throw new Error('Файл бэкапа не найден');
    }

    console.log('⚠️  ВНИМАНИЕ: Это перезапишет текущую базу данных!');
    const confirm = await question('Продолжить? (y/N): ');
    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ Восстановление отменено');
      return false;
    }

    process.env.PGPASSWORD = password;
    const command = `"${PSQL_PATH}" -h ${host} -p ${port} -U ${user} -d ${database} -f "${backupPath}"`;

    console.log('🔄 Восстанавливаем бэкап...');
    execSync(command, { stdio: 'inherit' });

    console.log('✅ Бэкап восстановлен успешно!');
    return true;
  } catch (error) {
    console.error('❌ Ошибка восстановления:', error.message);
    return false;
  }
}

function showBackupList() {
  const backups = getBackupFiles();
  
  if (backups.length === 0) {
    console.log('📂 Бэкапы не найдены');
    return;
  }

  console.log('📂 Доступные бэкапы:');
  backups.forEach((file, index) => {
    const info = getFileInfo(file);
    console.log(`  ${index + 1}. ${info.name}`);
    console.log(`     📊 ${info.size} | 📅 ${info.date}`);
    console.log('');
  });
}

// Главное меню
async function showMenu() {
  console.log('\n🎯 МЕНЕДЖЕР БЭКАПОВ БАЗЫ ДАННЫХ');
  console.log('═'.repeat(50));
  
  const backups = getBackupFiles();
  const latestBackup = backups[0] ? getFileInfo(backups[0]) : null;
  
  if (latestBackup) {
    console.log('📅 Последний бэкап:');
    console.log(`   ${latestBackup.name}`);
    console.log(`   📊 ${latestBackup.size} | 📅 ${latestBackup.date}`);
  } else {
    console.log('📭 Бэкапы не найдены');
  }
  
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║ Выберите действие:                                    ║');
  console.log('║ 1. 📦 Создать новый бэкап                            ║');
  console.log('║ 2. 🔄 Восстановить из бэкапа                         ║');
  console.log('║ 3. 📂 Показать список бэкапов                       ║');
  console.log('║ 4. 🚪 Выход                                         ║');
  console.log('╚══════════════════════════════════════════════════════╝');
}

async function main() {
  try {
    while (true) {
      await showMenu();
      const choice = await question('\nВаш выбор (1-4): ');

      switch (choice) {
        case '1':
          await createBackup();
          break;

        case '2':
          const backups = getBackupFiles();
          if (backups.length === 0) {
            console.log('❌ Нет доступных бэкапов для восстановления');
            break;
          }
          
          console.log('\n📂 Выберите бэкап для восстановления:');
          backups.forEach((file, index) => {
            const info = getFileInfo(file);
            console.log(`  ${index + 1}. ${info.name} (${info.size})`);
          });
          
          const backupChoice = await question(`\nВыберите бэкап (1-${backups.length}): `);
          const selectedIndex = parseInt(backupChoice) - 1;
          
          if (selectedIndex >= 0 && selectedIndex < backups.length) {
            await restoreBackup(backups[selectedIndex]);
          } else {
            console.log('❌ Неверный выбор');
          }
          break;

        case '3':
          showBackupList();
          break;

        case '4':
          console.log('👋 До свидания!');
          rl.close();
          return;

        default:
          console.log('❌ Неверный выбор, попробуйте снова');
      }

      await question('\nНажмите Enter для продолжения...');
      console.clear();
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    rl.close();
  }
}

// Запуск
if (require.main === module) {
  console.clear();
  main().catch(console.error);
}

module.exports = { createBackup, restoreBackup, getBackupFiles };