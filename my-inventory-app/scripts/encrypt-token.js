const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Введите ваш GitHub токен: ', (token) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32).toString('hex');
  const iv = crypto.randomBytes(16).toString('hex');
  
  // Простое шифрование без дополнительных преобразований
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const result = {
    encryptedToken: encrypted,
    iv: iv
  };
  
  console.log('\n✅ ТОКЕН УСПЕШНО ЗАШИФРОВАН!');
  console.log('\n📁 ДОБАВЬТЕ В .env ФАЙЛ:');
  console.log(`ENCRYPTED_GITHUB_TOKEN=${JSON.stringify(result)}`);
  console.log(`ENCRYPTION_KEY=${key}`);
  
  rl.close();
});