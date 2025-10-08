const crypto = require('crypto');

function decryptToken(encryptedData, encryptionKey) {
  try {
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
    
    return decrypted;
  } catch (error) {
    throw new Error('Ошибка дешифровки токена: ' + error.message);
  }
}

module.exports = { decryptToken };