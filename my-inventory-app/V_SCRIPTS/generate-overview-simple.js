// обзорный_скрипт/generate-overview-simple.js
const ProjectAnalyzer = require('./analyze-project');
const fs = require('fs');
const path = require('path');

// Простая версия без сложных зависимостей
function generateSimpleOverview() {
  const analyzer = new ProjectAnalyzer();
  analyzer.analyze();

  let overview = `# 📊 ОБЗОР ПРОЕКТА - СИСТЕМА УПРАВЛЕНИЯ ТОВАРАМИ\n`;
  overview += `Сгенерировано: ${new Date().toLocaleString('ru-RU')}\n\n`;

  // 1. README файлы
  overview += `## 📚 README ФАЙЛЫ API (${analyzer.readmeFiles.length})\n\n`;
  analyzer.readmeFiles.forEach(readme => {
    overview += `- **${readme.name}** - ${readme.relativePath}\n`;
  });
  overview += '\n';

  // 2. API роуты
  overview += `## 🚀 API РОУТЫ (${analyzer.apiRoutes.length})\n\n`;
  analyzer.apiRoutes.forEach(route => {
    overview += `- **${route.endpoints}** [${route.methods.join(',')}] - ${route.summary}\n`;
    overview += `  📁 ${route.relativePath}\n`;
  });
  overview += '\n';

  // 3. Компоненты
  overview += `## ⚛️ КОМПОНЕНТЫ (${analyzer.components.length})\n\n`;
  analyzer.components.forEach(comp => {
    overview += `- **${comp.name}** - ${comp.summary}\n`;
    overview += `  📁 ${comp.relativePath}\n`;
  });
  overview += '\n';

  // 4. Страницы
  overview += `## 📄 СТРАНИЦЫ (${analyzer.pages.length})\n\n`;
  analyzer.pages.forEach(page => {
    overview += `- **${page.relativePath}**\n`;
  });
  overview += '\n';

  // 5. Архитектура
  overview += `## 🏗 АРХИТЕКТУРА СИСТЕМЫ\n\n`;
  overview += `### Основные сущности:\n`;
  overview += `- **ProductUnit** - товарная единица\n`;
  overview += `- **Product** - товар\n`;
  overview += `- **Category** - категория\n`;
  overview += `- **Spine** - группировка\n`;
  overview += `- **Supplier** - поставщик\n`;
  overview += `- **Customer** - покупатель\n\n`;

  overview += `### Статусная модель:\n`;
  overview += `**Card Status:** CLEAR → CANDIDATE → IN_REQUEST → IN_DELIVERY → ARRIVED → IN_STORE\n`;
  overview += `**Physical Status:** IN_STORE ↔ SOLD/CREDIT\n\n`;

  // Сохраняем файл
  const outputPath = path.join(__dirname, 'project-overview-simple.txt');
  fs.writeFileSync(outputPath, overview, 'utf8');
  
  console.log('✅ Обзор сохранен в:', outputPath);
  console.log('📊 Статистика:');
  console.log(`   README: ${analyzer.readmeFiles.length}`);
  console.log(`   API: ${analyzer.apiRoutes.length}`);
  console.log(`   Components: ${analyzer.components.length}`);
  console.log(`   Pages: ${analyzer.pages.length}`);

  return overview;
}

// Запускаем
generateSimpleOverview();