// lib/decryption/decrypt-token.ts
import crypto from 'crypto';

export function decryptToken(encryptedData: string | any, encryptionKey: string): string {
  try {
    console.log('🔐 DecryptToken: Начало дешифровки');
    
    const data = typeof encryptedData === 'string' 
      ? JSON.parse(encryptedData) 
      : encryptedData;
    
    const algorithm = 'aes-256-cbc';
    
    const decipher = crypto.createDecipheriv(
      algorithm, 
      Buffer.from(encryptionKey, 'hex'), 
      Buffer.from(data.iv, 'hex')
    );
    
    let decrypted = decipher.update(data.encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log('✅ DecryptToken: Токен успешно дешифрован');
    return decrypted;
  } catch (error) {
    console.error('❌ DecryptToken: Ошибка дешифровки:', error);
    throw new Error('Ошибка дешифровки токена: ' + error.message);
  }
}