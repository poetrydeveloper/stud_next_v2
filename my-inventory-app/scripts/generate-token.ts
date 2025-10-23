// scripts/generate-token.ts
import { encryptToken } from '@/lib/decryption/encrypt-token';

// Запуск: npx tsx scripts/generate-token.ts
if (require.main === module) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Введите ваш GitHub токен: ', (token) => {
    try {
      encryptToken(token);
      console.log('\n🎉 Токен успешно зашифрован! Скопируйте значения в .env файл.');
    } catch (error) {
      console.error('❌ Ошибка:', error.message);
    } finally {
      rl.close();
    }
  });
}