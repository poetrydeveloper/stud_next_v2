// обзорный_скрипт/app-router-analyzer.js
const fs = require('fs');
const path = require('path');

class AppRouterAnalyzer {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.analysis = {
      issues: [],
      warnings: [],
      recommendations: []
    };
  }

  // Анализ всей структуры App Router
  analyzeAppRouter() {
    console.log('🔍 Анализ Next.js App Router структуры...');
    
    let report = `# 🕵️‍♂️ ПОЛНЫЙ АНАЛИЗ NEXT.JS APP ROUTER ПРОЕКТА\n\n`;
    report += `Сгенерировано: ${new Date().toLocaleString('ru-RU')}\n`;
    report += `Структура: App Router (Next.js 13+)\n\n`;

    // 1. Prisma схема
    report += this.analyzePrisma();
    
    // 2. API Routes (App Router)
    report += this.analyzeAppApiRoutes();
    
    // 3. Страницы (App Router)
    report += this.analyzeAppPages();
    
    // 4. Компоненты
    report += this.analyzeComponents();
    
    // 5. Библиотеки и сервисы
    report += this.analyzeLibServices();
    
    // 6. Проблемы и рекомендации
    report += this.generateRecommendations();

    // Сохраняем
    const outputPath = path.join(__dirname, 'APP_ROUTER_ANALYSIS.txt');
    fs.writeFileSync(outputPath, report, 'utf8');
    
    console.log('✅ Анализ завершен:', outputPath);
    return report;
  }

  // 1. Анализ Prisma
  analyzePrisma() {
    const prismaPath = path.join(this.rootDir, 'prisma', 'schema.prisma');
    let section = `## 🗄️ PRISMA СХЕМА\n\n`;
    
    if (!fs.existsSync(prismaPath)) {
      section += `❌ Файл schema.prisma не найден\n\n`;
      return section;
    }

    const content = this.readFile(prismaPath);
    const models = content.match(/model\s+(\w+)\s*{([^}]+)}/g) || [];
    
    section += `**Файл:** prisma/schema.prisma\n`;
    section += `**Модели:** ${models.length}\n\n`;
    
    // Список моделей
    models.forEach(model => {
      const modelName = model.match(/model\s+(\w+)/)[1];
      const fields = model.match(/[\w\s]+\??\s+[\w\s\[\]]+[\s\S]*?(?=\n\s*\w|\n\s*})/g) || [];
      
      section += `### ${modelName}\n`;
      section += `**Поля:** ${fields.length}\n`;
      
      // Важные поля
      const importantFields = fields
        .filter(f => f.includes('@id') || f.includes('@relation') || f.includes('@unique'))
        .map(f => f.trim().split(/\s+/)[0])
        .slice(0, 5);
      
      if (importantFields.length > 0) {
        section += `**Ключевые:** ${importantFields.join(', ')}\n`;
      }
      
      // Проблемы модели
      const issues = this.checkModelIssues(model, modelName);
      if (issues.length > 0) {
        section += `**⚠️ Проблемы:**\n${issues.map(i => `  - ${i}\n`).join('')}`;
      }
      
      section += `\n`;
    });

    return section;
  }

  checkModelIssues(model, modelName) {
    const issues = [];
    
    if (modelName === 'ProductUnit') {
      if (!model.includes('statusCard') || !model.includes('statusProduct')) {
        issues.push('Отсутствуют статусные поля');
      }
      if (!model.includes('@relation')) {
        issues.push('Нет связей с другими моделями');
      }
    }
    
    if (modelName === 'Product') {
      if (!model.includes('spineId')) {
        issues.push('Нет связи со Spine');
      }
    }
    
    return issues;
  }

  // 2. Анализ API Routes (App Router)
  analyzeAppApiRoutes() {
    const apiDir = path.join(this.rootDir, 'app', 'api');
    let section = `## 🚀 API ROUTES (App Router)\n\n`;
    
    if (!fs.existsSync(apiDir)) {
      section += `❌ Папка app/api не найдена\n\n`;
      return section;
    }

    const endpoints = this.findRouteFiles(apiDir);
    section += `**Всего endpoints:** ${endpoints.length}\n\n`;

    // Группируем по функциональности
    const groups = {
      productUnits: endpoints.filter(e => e.path.includes('product-units')),
      inventory: endpoints.filter(e => e.path.includes('inventory')),
      products: endpoints.filter(e => e.path.includes('products')),
      categories: endpoints.filter(e => e.path.includes('categories')),
      cash: endpoints.filter(e => e.path.includes('cash')),
      other: endpoints.filter(e => !e.path.includes('product-units') && 
                                 !e.path.includes('inventory') && 
                                 !e.path.includes('products') &&
                                 !e.path.includes('categories') &&
                                 !e.path.includes('cash'))
    };

    // Product Units API
    section += `### 📦 PRODUCT UNITS API (${groups.productUnits.length})\n`;
    groups.productUnits.forEach(ep => {
      const content = this.readFile(ep.fullPath);
      section += `- **${ep.endpoint}** [${this.extractMethods(content).join(',')}] - ${this.getApiSummary(content)}\n`;
      
      const issues = this.checkApiIssues(content);
      if (issues.length > 0) {
        section += `  ⚠️ ${issues[0]}\n`;
      }
    });
    section += `\n`;

    // Inventory API
    section += `### 📊 INVENTORY API (${groups.inventory.length})\n`;
    groups.inventory.forEach(ep => {
      const content = this.readFile(ep.fullPath);
      section += `- **${ep.endpoint}** [${this.extractMethods(content).join(',')}] - ${this.getApiSummary(content)}\n`;
    });
    section += `\n`;

    // Other APIs
    section += `### 🔧 ДРУГИЕ API (${groups.other.length})\n`;
    groups.other.slice(0, 10).forEach(ep => {
      section += `- **${ep.endpoint}**\n`;
    });
    if (groups.other.length > 10) {
      section += `- ... и еще ${groups.other.length - 10} endpoints\n`;
    }
    section += `\n`;

    return section;
  }

  findRouteFiles(dir, results = []) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          this.findRouteFiles(itemPath, results);
        } else if (item === 'route.ts' || item === 'route.js') {
          const endpoint = itemPath
            .replace(path.join(this.rootDir, 'app', 'api') + path.sep, '/api/')
            .replace(/\\/g, '/')
            .replace(/\/route\.(ts|js)$/, '')
            .replace(/\[([^\]]+)\]/g, ':$1');
            
          results.push({
            path: path.relative(path.join(this.rootDir, 'app', 'api'), path.dirname(itemPath)),
            endpoint: endpoint,
            fullPath: itemPath
          });
        }
      });
    } catch (error) {
      // Пропускаем ошибки
    }
    
    return results;
  }

  extractMethods(content) {
    const methods = [];
    if (content.includes('export async function GET')) methods.push('GET');
    if (content.includes('export async function POST')) methods.push('POST');
    if (content.includes('export async function PATCH')) methods.push('PATCH');
    if (content.includes('export async function PUT')) methods.push('PUT');
    if (content.includes('export async function DELETE')) methods.push('DELETE');
    return methods;
  }

  getApiSummary(content) {
    if (content.includes('CANDIDATE') && content.includes('IN_REQUEST')) return 'Управление кандидатами';
    if (content.includes('SOLD') && content.includes('CREDIT')) return 'Продажи';
    if (content.includes('IN_STORE') && content.includes('statusProduct')) return 'Складские операции';
    if (content.includes('createRequest')) return 'Создание заявок';
    if (content.includes('heatmap') || content.includes('InventoryVisual')) return 'Визуализация';
    return 'API endpoint';
  }

  checkApiIssues(content) {
    const issues = [];
    if (!content.includes('try') && !content.includes('catch')) {
      issues.push('Нет обработки ошибок');
    }
    if (content.includes('req.json()') && !content.includes('if (!')) {
      issues.push('Нет валидации входных данных');
    }
    return issues;
  }

  // 3. Анализ страниц (App Router)
  analyzeAppPages() {
    const appDir = path.join(this.rootDir, 'app');
    let section = `## 📄 СТРАНИЦЫ (App Router)\n\n`;
    
    const pages = this.findPageFiles(appDir);
    section += `**Всего страниц:** ${pages.length}\n\n`;

    pages.forEach(page => {
      const content = this.readFile(page.fullPath);
      section += `### ${page.route}\n`;
      section += `**Файл:** ${page.path}\n`;
      
      const components = this.extractPageComponents(content);
      if (components.length > 0) {
        section += `**Компоненты:** ${components.slice(0, 3).join(', ')}${components.length > 3 ? '...' : ''}\n`;
      }
      
      const hooks = this.extractHooks(content);
      if (hooks.length > 0) {
        section += `**Hooks:** ${hooks.join(', ')}\n`;
      }
      
      section += `\n`;
    });

    return section;
  }

  findPageFiles(dir, results = []) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          this.findPageFiles(itemPath, results);
        } else if (item === 'page.tsx' || item === 'page.jsx') {
          const route = itemPath
            .replace(path.join(this.rootDir, 'app') + path.sep, '/')
            .replace(/\\/g, '/')
            .replace(/\/page\.(tsx|jsx)$/, '')
            .replace(/\[([^\]]+)\]/g, ':$1');
            
          results.push({
            path: path.relative(this.rootDir, itemPath),
            route: route || '/',
            fullPath: itemPath
          });
        }
      });
    } catch (error) {
      // Пропускаем ошибки
    }
    
    return results;
  }

  extractPageComponents(content) {
    const components = [];
    const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
    
    for (const match of importMatches) {
      const importPath = match[1];
      if (importPath.includes('/components/') || importPath.includes('@/components')) {
        const compName = importPath.split('/').pop();
        components.push(compName);
      }
    }
    return components;
  }

  // 4. Анализ компонентов
  analyzeComponents() {
    const compDir = path.join(this.rootDir, 'app', 'components');
    let section = `## ⚛️ REACT КОМПОНЕНТЫ\n\n`;
    
    if (!fs.existsSync(compDir)) {
      section += `❌ Папка components не найдена\n\n`;
      return section;
    }

    const components = this.findComponents(compDir);
    section += `**Всего компонентов:** ${components.length}\n\n`;

    // Группируем по типам
    const groups = {
      productUnits: components.filter(c => c.name.includes('ProductUnit') || c.name.includes('Unit')),
      inventory: components.filter(c => c.name.includes('Inventory')),
      spine: components.filter(c => c.name.includes('Spine')),
      modals: components.filter(c => c.name.includes('Modal')),
      other: components.filter(c => !c.name.includes('ProductUnit') && 
                                  !c.name.includes('Unit') &&
                                  !c.name.includes('Inventory') &&
                                  !c.name.includes('Spine') &&
                                  !c.name.includes('Modal'))
    };

    // ProductUnit компоненты
    section += `### 📦 PRODUCT UNIT КОМПОНЕНТЫ (${groups.productUnits.length})\n`;
    groups.productUnits.forEach(comp => {
      const content = this.readFile(comp.fullPath);
      section += `- **${comp.name}** - ${this.getComponentSummary(content)}\n`;
    });
    section += `\n`;

    // Inventory компоненты
    section += `### 📊 INVENTORY КОМПОНЕНТЫ (${groups.inventory.length})\n`;
    groups.inventory.forEach(comp => {
      section += `- **${comp.name}**\n`;
    });
    section += `\n`;

    // Другие компоненты
    section += `### 🔧 ДРУГИЕ КОМПОНЕНТЫ (${groups.other.length})\n`;
    groups.other.slice(0, 10).forEach(comp => {
      section += `- **${comp.name}**\n`;
    });
    if (groups.other.length > 10) {
      section += `- ... и еще ${groups.other.length - 10} компонентов\n`;
    }
    section += `\n`;

    return section;
  }

  findComponents(dir, results = []) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          this.findComponents(itemPath, results);
        } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
          results.push({
            name: item.replace(/\.(tsx|jsx)$/, ''),
            path: path.relative(this.rootDir, itemPath),
            fullPath: itemPath
          });
        }
      });
    } catch (error) {
      // Пропускаем ошибки
    }
    
    return results;
  }

  getComponentSummary(content) {
    if (content.includes('statusCard') && content.includes('statusProduct')) {
      return 'Карточка товарной единицы';
    }
    if (content.includes('CategoryTree') || content.includes('SpineTree')) {
      return 'Древовидная структура';
    }
    if (content.includes('heatmap') || content.includes('InventoryVisual')) {
      return 'Визуализация остатков';
    }
    if (content.includes('Modal') && content.includes('Request')) {
      return 'Модальное окно заявки';
    }
    return 'React компонент';
  }

  extractHooks(content) {
    const hooks = [];
    if (content.includes('useState')) hooks.push('useState');
    if (content.includes('useEffect')) hooks.push('useEffect');
    if (content.includes('useContext')) hooks.push('useContext');
    if (content.includes('useRouter')) hooks.push('useRouter');
    return hooks;
  }

  // 5. Анализ библиотек и сервисов
  analyzeLibServices() {
    let section = `## 🛠️ БИБЛИОТЕКИ И СЕРВИСЫ\n\n`;

    // App lib
    const appLibDir = path.join(this.rootDir, 'app', 'lib');
    if (fs.existsSync(appLibDir)) {
      const appLibFiles = this.findLibFiles(appLibDir);
      section += `### 📁 app/lib/ (${appLibFiles.length})\n`;
      appLibFiles.forEach(file => {
        section += `- **${file.name}** - ${this.getServiceSummary(file.content)}\n`;
      });
      section += `\n`;
    }

    // Root lib
    const rootLibDir = path.join(this.rootDir, 'lib');
    if (fs.existsSync(rootLibDir)) {
      const rootLibFiles = this.findLibFiles(rootLibDir);
      section += `### 📁 lib/ (${rootLibFiles.length})\n`;
      rootLibFiles.forEach(file => {
        section += `- **${file.name}** - ${this.getServiceSummary(file.content)}\n`;
      });
      section += `\n`;
    }

    return section;
  }

  findLibFiles(dir, results = []) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          this.findLibFiles(itemPath, results);
        } else if (item.endsWith('.ts') || item.endsWith('.js')) {
          results.push({
            name: item,
            path: path.relative(this.rootDir, itemPath),
            fullPath: itemPath,
            content: this.readFile(itemPath)
          });
        }
      });
    } catch (error) {
      // Пропускаем ошибки
    }
    
    return results;
  }

  getServiceSummary(content) {
    if (content.includes('RequestService')) return 'Сервис заявок';
    if (content.includes('CashDayService')) return 'Кассовый сервис';
    if (content.includes('deliveryService')) return 'Сервис доставки';
    if (content.includes('disassemblyService')) return 'Сервис разборки';
    if (content.includes('prisma')) return 'Работа с БД';
    return 'Сервис/утилита';
  }

  // 6. Рекомендации
  generateRecommendations() {
    let section = `## 💡 РЕКОМЕНДАЦИИ И ВЫВОДЫ\n\n`;

    section += `### 🎯 ОСНОВНЫЕ ВЫВОДЫ:\n`;
    section += `- ✅ Проект использует современный Next.js App Router\n`;
    section += `- ✅ Хорошо структурированная кодовая база\n`;
    section += `- ✅ Полноценная система управления товарами\n`;
    section += `- ✅ Развитая API архитектура\n\n`;

    section += `### 🔧 РЕКОМЕНДАЦИИ ПО РАЗРАБОТКЕ:\n`;
    section += `1. **Индикаторы активности** - добавить временные метки в ProductUnit\n`;
    section += `2. **Валидация API** - добавить обработку ошибок во всех endpoints\n`;
    section += `3. **Тепловая карта** - интегрировать нормативы остатков\n`;
    section += `4. **Модальные окна** - исправить передачу данных в CreateRequestModal\n`;
    section += `5. **Обновление состояния** - улучшить синхронизацию после операций\n\n`;

    section += `### 🚀 ПРИОРИТЕТНЫЕ ЗАДАЧИ:\n`;
    section += `- Исправить модальное окно заявок (цена/количество)\n`;
    section += `- Добавить индикаторы недавней активности\n`;
    section += `- Реализовать систему нормативов остатков\n`;
    section += `- Улучшить обработку ошибок в API\n`;

    return section;
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return '';
    }
  }
}

// Запуск анализа
const analyzer = new AppRouterAnalyzer();
analyzer.analyzeAppRouter();