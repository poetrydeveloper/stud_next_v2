// обзорный_скрипт/generate-overview.js
const ProjectAnalyzer = require('./analyze-project');
const fs = require('fs');

class OverviewGenerator {
  constructor(analyzer) {
    this.analyzer = analyzer;
  }

  generate() {
    let overview = `# 📊 ОБЗОР ПРОЕКТА - СИСТЕМА УПРАВЛЕНИЯ ТОВАРАМИ\n`;
    overview += `Сгенерировано: ${new Date().toLocaleString('ru-RU')}\n\n`;

    // 1. Сводка по README файлам
    overview += this.generateReadmeSection();
    
    // 2. API роуты
    overview += this.generateApiSection();
    
    // 3. Компоненты
    overview += this.generateComponentsSection();
    
    // 4. Страницы
    overview += this.generatePagesSection();
    
    // 5. Общая архитектура
    overview += this.generateArchitectureSection();

    return overview;
  }

  generateReadmeSection() {
    let section = `## 📚 README ФАЙЛЫ API\n\n`;
    
    this.analyzer.readmeFiles.forEach(readme => {
      const content = this.analyzer.readFileContent(readme.path);
      const title = content.split('\n')[0].replace('#', '').trim();
      
      section += `### ${readme.name}\n`;
      section += `**Путь:** ${readme.relativePath}\n`;
      section += `**Описание:** ${title}\n\n`;
      
      // Краткое содержание (первые 3 строки после заголовка)
      const lines = content.split('\n').slice(1, 6).filter(line => line.trim());
      if (lines.length > 0) {
        section += `**Кратко:** ${lines.join(' ').substring(0, 200)}...\n\n`;
      }
    });

    return section;
  }

  generateApiSection() {
    let section = `## 🚀 API РОУТЫ\n\n`;
    
    this.analyzer.apiRoutes.forEach(route => {
      section += `### ${route.endpoints}\n`;
      section += `**Методы:** ${route.methods.join(', ')}\n`;
      section += `**Тип:** ${route.summary}\n`;
      section += `**Путь:** ${route.relativePath}\n\n`;
      
      // Ключевые слова из кода
      const keywords = this.extractKeywords(this.analyzer.readFileContent(route.path));
      if (keywords.length > 0) {
        section += `**Ключевые операции:** ${keywords.join(', ')}\n\n`;
      }
    });

    return section;
  }

  generateComponentsSection() {
    let section = `## ⚛️ КОМПОНЕНТЫ\n\n`;
    
    // Группируем по папкам
    const componentsByFolder = {};
    this.analyzer.components.forEach(comp => {
      const folder = path.dirname(comp.relativePath).split('/').pop();
      if (!componentsByFolder[folder]) componentsByFolder[folder] = [];
      componentsByFolder[folder].push(comp);
    });

    Object.entries(componentsByFolder).forEach(([folder, components]) => {
      section += `### 📁 ${folder}\n`;
      
      components.forEach(comp => {
        section += `#### ${comp.name}\n`;
        section += `**Назначение:** ${comp.summary}\n`;
        if (comp.props.length > 0) {
          section += `**Props:** ${comp.props.join(', ')}\n`;
        }
        if (comp.hooks.length > 0) {
          section += `**Hooks:** ${comp.hooks.join(', ')}\n`;
        }
        section += `**Путь:** ${comp.relativePath}\n\n`;
      });
    });

    return section;
  }

  generatePagesSection() {
    let section = `## 📄 СТРАНИЦЫ\n\n`;
    
    this.analyzer.pages.forEach(page => {
      const content = this.analyzer.readFileContent(page.path);
      section += `### ${page.relativePath}\n`;
      
      // Ищем заголовок страницы
      const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/);
      if (titleMatch) {
        section += `**Заголовок:** ${titleMatch[1]}\n`;
      }
      
      // Импорты компонентов
      const imports = this.extractImports(content);
      if (imports.length > 0) {
        section += `**Использует:** ${imports.join(', ')}\n`;
      }
      
      section += `\n`;
    });

    return section;
  }

  generateArchitectureSection() {
    let section = `## 🏗 АРХИТЕКТУРА СИСТЕМЫ\n\n`;

    section += `### Основные сущности:\n`;
    section += `- **ProductUnit** - товарная единица (основная бизнес-сущность)\n`;
    section += `- **Product** - товар (каталог)\n`;
    section += `- **Category** - категория товаров\n`;
    section += `- **Spine** - группировка товаров\n`;
    section += `- **Supplier** - поставщик\n`;
    section += `- **Customer** - покупатель\n\n`;

    section += `### Статусная модель ProductUnit:\n`;
    section += `**Card Status:** CLEAR → CANDIDATE → IN_REQUEST → IN_DELIVERY → ARRIVED → IN_STORE\n`;
    section += `**Physical Status:** IN_STORE ↔ SOLD/CREDIT (с возвратами)\n\n`;

    section += `### Ключевые бизнес-процессы:\n`;
    section += `1. Создание товара → Добавление в кандидаты → Заявка → Поставка → Продажа\n`;
    section += `2. Множественные заявки через SPROUTED родителя\n`;
    section += `3. Возвраты и управление кредитами\n`;
    section += `4. Тепловая карта остатков с нормативами\n\n`;

    return section;
  }

  extractKeywords(content) {
    const keywords = [
      'CANDIDATE', 'IN_REQUEST', 'SPROUTED', 'IN_STORE', 'SOLD', 'CREDIT',
      'createRequest', 'delivery', 'sale', 'return', 'revert', 'inventory',
      'heatmap', 'stock', 'supplier', 'customer', 'category', 'spine'
    ];
    
    return keywords.filter(keyword => 
      content.includes(keyword) || content.includes(keyword.toLowerCase())
    );
  }

  extractImports(content) {
    const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
    const imports = Array.from(importMatches).map(match => match[1]);
    
    return imports.filter(imp => 
      imp.includes('/components/') || imp.includes('@/components')
    ).map(imp => {
      const parts = imp.split('/');
      return parts[parts.length - 1];
    });
  }

  saveToFile(content, filename = 'project-overview.txt') {
    fs.writeFileSync(path.join(__dirname, filename), content, 'utf8');
    console.log(`✅ Обзор сохранен в файл: ${filename}`);
  }
}

// Запуск анализа
const analyzer = new ProjectAnalyzer();
analyzer.analyze();

const generator = new OverviewGenerator(analyzer);
const overview = generator.generate();
generator.saveToFile(overview);

console.log('🎉 Генерация обзора завершена!');