// lib/decryption/encrypt-token.ts
import crypto from 'crypto';

/**
 * Шифрует токен для безопасного хранения в .env
 */
export function encryptToken(token: string): { encryptedToken: string; iv: string; key: string } {
  try {
    console.log('🔐 EncryptToken: Начало шифровки токена');
    
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    
    const cipher = crypto.createCipheriv(
      algorithm, 
      Buffer.from(key, 'hex'), 
      Buffer.from(iv, 'hex')
    );
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const result = {
      encryptedToken: encrypted,
      iv: iv
    };
    
    console.log('✅ EncryptToken: Токен успешно зашифрован!');
    console.log('📁 Добавьте в .env файл:');
    console.log(`ENCRYPTED_GITHUB_TOKEN=${JSON.stringify(result)}`);
    console.log(`ENCRYPTION_KEY=${key}`);
    
    return { encryptedToken: encrypted, iv, key };
  } catch (error) {
    console.error('❌ EncryptToken: Ошибка шифровки:', error);
    throw new Error('Ошибка шифровки токена: ' + error.message);
  }
}

/**
 * Утилита для создания зашифрованного токена через командную строку
 */
export function createEncryptedTokenCLI() {
  if (typeof window !== 'undefined') {
    console.log('⚠️  Эта функция работает только в Node.js среде');
    return;
  }

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Введите ваш GitHub токен: ', (token) => {
    try {
      encryptToken(token);
    } catch (error) {
      console.error('❌ Ошибка:', error.message);
    } finally {
      rl.close();
    }
  });
}