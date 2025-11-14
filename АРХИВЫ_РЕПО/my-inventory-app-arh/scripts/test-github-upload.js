require('dotenv').config();
const { Octokit } = require('octokit');
const crypto = require('crypto');

// Функция дешифровки (упрощенная версия)
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

async function testGitHubUpload() {
  console.log('🔧 Testing GitHub upload...');
  
  try {
    // Дешифруем токен
    const encryptedToken = process.env.ENCRYPTED_GITHUB_TOKEN;
    const encryptionKey = process.env.ENCRYPTION_KEY;
    
    if (!encryptedToken || !encryptionKey) {
      throw new Error('GitHub token not configured in .env');
    }

    const token = decryptToken(encryptedToken, encryptionKey);
    console.log('✅ Token decrypted successfully');

    // Создаем Octokit клиент
    const octokit = new Octokit({ auth: token });

    const owner = process.env.GITHUB_MEDIA_OWNER || 'gumerovm74';
    const repo = process.env.GITHUB_MEDIA_REPO || 'my-inventory-app_media';
    const branch = process.env.GITHUB_MEDIA_BRANCH || 'main';

    // Создаем тестовый файл
    const testContent = 'test image content ' + Date.now();
    const content = Buffer.from(testContent).toString('base64');
    const path = `test/test-${Date.now()}.txt`;

    console.log('📤 Uploading to GitHub...');
    console.log(`📁 Repo: ${owner}/${repo}`);
    console.log(`📄 Path: ${path}`);

    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      message: `Test upload ${path}`,
      content: content,
      branch: branch,
    });

    console.log('✅ Upload successful!');
    console.log('📎 Download URL:', response.data.content.download_url);
    console.log('🔗 HTML URL:', response.data.content.html_url);
    
  } catch (error) {
    console.error('❌ Upload failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('GitHub API response:', error.response.data);
    }
  }
}

testGitHubUpload();