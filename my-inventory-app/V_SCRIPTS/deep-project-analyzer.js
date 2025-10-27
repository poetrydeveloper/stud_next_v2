// обзорный_скрипт/deep-project-analyzer.js
const fs = require('fs');
const path = require('path');

class DeepProjectAnalyzer {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.analysis = {
      issues: [],
      warnings: [],
      recommendations: []
    };
  }

  // 1. Анализ всех файлов проекта
  analyzeAllFiles() {
    console.log('🔍 Глубокий анализ проекта...');
    
    const allFiles = this.findAllFiles(this.rootDir);
    console.log(`📊 Найдено файлов: ${allFiles.length}`);

    const structure = {
      prisma: allFiles.filter(f => f.relativePath.includes('prisma') || f.name.includes('.prisma')),
      api: allFiles.filter(f => f.relativePath.includes('/api/')),
      components: allFiles.filter(f => f.relativePath.includes('/components/')),
      pages: allFiles.filter(f => f.relativePath.includes('/app/') && f.name.match(/page\.(tsx|jsx|ts|js)$/)),
      lib: allFiles.filter(f => f.relativePath.includes('/lib/')),
      hooks: allFiles.filter(f => f.relativePath.includes('use') && f.name.endsWith('.ts')),
      types: allFiles.filter(f => f.name.includes('.d.ts') || f.relativePath.includes('types')),
      config: allFiles.filter(f => f.name.match(/package\.json|tsconfig|next\.config|\.env/)),
      other: allFiles.filter(f => 
        !f.relativePath.includes('/api/') &&
        !f.relativePath.includes('/components/') &&
        !f.relativePath.includes('/lib/') &&
        !f.relativePath.includes('/app/') &&
        !f.relativePath.includes('prisma') &&
        !f.name.match(/package\.json|tsconfig|next\.config|\.env/)
      )
    };

    return structure;
  }

  // 2. Анализ Prisma схемы
  analyzePrisma(files) {
    const prismaFile = files.find(f => f.name === 'schema.prisma');
    if (!prismaFile) {
      this.analysis.issues.push('❌ Не найден schema.prisma файл');
      return null;
    }

    const content = this.readFile(prismaFile.path);
    const models = content.match(/model\s+(\w+)\s*{([^}]+)}/g) || [];
    
    return {
      file: prismaFile.relativePath,
      models: models.length,
      modelNames: models.map(m => m.match(/model\s+(\w+)/)[1]),
      issues: this.checkPrismaIssues(content)
    };
  }

  checkPrismaIssues(content) {
    const issues = [];
    
    // Проверка отсутствующих отношений
    if (content.includes('ProductUnit') && !content.includes('@relation')) {
      issues.push('⚠️ Возможно отсутствуют связи между моделями');
    }
    
    // Проверка индексов
    if (content.includes('@unique') && !content.includes('@@index')) {
      issues.push('⚠️ Возможно недостаточно индексов для производительности');
    }
    
    return issues;
  }

  // 3. Анализ API endpoints
  analyzeApiEndpoints(files) {
    const endpoints = files.map(file => {
      const content = this.readFile(file.path);
      return {
        path: file.relativePath,
        endpoint: this.extractEndpoint(file.relativePath),
        methods: this.extractMethods(content),
        functions: this.extractFunctions(content),
        imports: this.extractImports(content),
        issues: this.checkApiIssues(content, file.relativePath)
      };
    });

    return endpoints;
  }

  extractEndpoint(filePath) {
    return filePath
      .replace(/^app\/api\//, '/api/')
      .replace(/\/route\.(ts|js)$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1');
  }

  extractMethods(content) {
    const methods = [];
    const methodPatterns = {
      GET: /export\s+async\s+function\s+GET/,
      POST: /export\s+async\s+function\s+POST/,
      PATCH: /export\s+async\s+function\s+PATCH/,
      PUT: /export\s+async\s+function\s+PUT/,
      DELETE: /export\s+async\s+function\s+DELETE/
    };

    for (const [method, pattern] of Object.entries(methodPatterns)) {
      if (pattern.test(content)) methods.push(method);
    }

    return methods;
  }

  extractFunctions(content) {
    const functions = [];
    const functionMatches = content.matchAll(/export\s+(async\s+)?function\s+(\w+)/g);
    
    for (const match of functionMatches) {
      functions.push(match[2]);
    }

    return functions;
  }

  extractImports(content) {
    const imports = [];
    const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
    
    for (const match of importMatches) {
      imports.push(match[1]);
    }

    return imports;
  }

  checkApiIssues(content, filePath) {
    const issues = [];
    
    // Проверка обработки ошибок
    if (!content.includes('try') && !content.includes('catch')) {
      issues.push('❌ Нет обработки ошибок (try/catch)');
    }
    
    // Проверка валидации
    if (content.includes('req.json()') && !content.includes('if (!') && !content.includes('required')) {
      issues.push('⚠️ Возможно отсутствует валидация входных данных');
    }
    
    // Проверка статусов ответов
    if (content.includes('NextResponse.json') && !content.includes('status:')) {
      issues.push('⚠️ Не указаны HTTP статусы для ошибок');
    }
    
    return issues;
  }

  // 4. Анализ компонентов React
  analyzeComponents(files) {
    return files.map(file => {
      const content = this.readFile(file.path);
      return {
        name: file.name.replace(/\.(tsx|jsx)$/, ''),
        path: file.relativePath,
        type: this.getComponentType(content),
        props: this.extractComponentProps(content),
        hooks: this.extractHooks(content),
        state: this.extractState(content),
        imports: this.extractImports(content),
        issues: this.checkComponentIssues(content, file.name)
      };
    });
  }

  getComponentType(content) {
    if (content.includes('export default function')) return 'Function Component';
    if (content.includes('export default class')) return 'Class Component';
    if (content.includes('"use client"')) return 'Client Component';
    if (content.includes('"use server"')) return 'Server Component';
    return 'Unknown';
  }

  extractComponentProps(content) {
    const props = [];
    const propMatches = content.matchAll(/(\w+)\s*:\s*(\w+)/g);
    
    for (const match of propMatches) {
      if (match[1] !== 'useState' && match[1] !== 'useEffect') {
        props.push(`${match[1]}: ${match[2]}`);
      }
    }

    return props.slice(0, 10); // Ограничиваем для читаемости
  }

  extractHooks(content) {
    const hooks = [];
    const hookPatterns = [
      'useState', 'useEffect', 'useContext', 'useReducer', 
      'useCallback', 'useMemo', 'useRef', 'useRouter'
    ];

    for (const hook of hookPatterns) {
      if (content.includes(hook)) hooks.push(hook);
    }

    return hooks;
  }

  extractState(content) {
    const stateVars = [];
    const stateMatches = content.matchAll(/const\s+\[([^,\]]+)/g);
    
    for (const match of stateMatches) {
      stateVars.push(match[1]);
    }

    return stateVars;
  }

  checkComponentIssues(content, fileName) {
    const issues = [];
    
    // Проверка пропсов
    if (content.includes('interface') && !content.includes('?')) {
      issues.push('⚠️ Возможно не все пропсы optional');
    }
    
    // Проверка ключей в map
    if (content.includes('.map(') && !content.includes('key=')) {
      issues.push('❌ Отсутствуют key props в .map()');
    }
    
    // Проверка обработчиков событий
    if (content.includes('onClick') && content.includes('async')) {
      issues.push('⚠️ Async функции в обработчиках событий могут вызвать проблемы');
    }
    
    return issues;
  }

  // 5. Анализ страниц
  analyzePages(files) {
    return files.map(file => {
      const content = this.readFile(file.path);
      return {
        route: this.extractPageRoute(file.relativePath),
        path: file.relativePath,
        components: this.extractPageComponents(content),
        hooks: this.extractHooks(content),
        dataFetching: this.checkDataFetching(content),
        issues: this.checkPageIssues(content)
      };
    });
  }

  extractPageRoute(filePath) {
    return filePath
      .replace(/^app\//, '/')
      .replace(/\/page\.(tsx|jsx)$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1');
  }

  extractPageComponents(content) {
    const components = [];
    const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
    
    for (const match of importMatches) {
      const importPath = match[1];
      if (importPath.includes('/components/')) {
        const compName = importPath.split('/').pop();
        components.push(compName);
      }
    }

    return components;
  }

  checkDataFetching(content) {
    const methods = [];
    if (content.includes('fetch(')) methods.push('fetch');
    if (content.includes('useEffect')) methods.push('useEffect');
    if (content.includes('getServerSideProps')) methods.push('SSR');
    if (content.includes('getStaticProps')) methods.push('SSG');
    return methods;
  }

  checkPageIssues(content) {
    const issues = [];
    
    if (content.includes('useState') && content.includes('useEffect') && content.includes('fetch')) {
      issues.push('⚠️ Возможно лучше использовать Server Components для data fetching');
    }
    
    return issues;
  }

  // 6. Утилитарные методы
  findAllFiles(dir, results = []) {
    try {
      if (!fs.existsSync(dir)) return results;

      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        try {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            if (!file.startsWith('.') && 
                !['node_modules', '.next', '.git', 'V_SCRIPTS'].includes(file)) {
              this.findAllFiles(filePath, results);
            }
          } else {
            results.push({
              path: filePath,
              relativePath: path.relative(this.rootDir, filePath),
              name: file,
              size: stat.size
            });
          }
        } catch (e) {
          // Пропускаем ошибки файлов
        }
      }
    } catch (e) {
      // Пропускаем ошибки директорий
    }
    
    return results;
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return `❌ Ошибка чтения: ${error.message}`;
    }
  }

  // 7. Генерация полного отчета
  generateFullReport() {
    console.log('📋 Генерируем полный отчет...');
    
    const structure = this.analyzeAllFiles();
    
    let report = `# 🕵️‍♂️ ПОЛНЫЙ АНАЛИЗ ПРОЕКТА - СИСТЕМА УПРАВЛЕНИЯ ТОВАРАМИ\n\n`;
    report += `Сгенерировано: ${new Date().toLocaleString('ru-RU')}\n`;
    report += `Корневая директория: ${this.rootDir}\n\n`;

    // 1. Prisma схема
    report += `## 🗄️ PRISMA СХЕМА\n\n`;
    const prismaAnalysis = this.analyzePrisma(structure.prisma);
    if (prismaAnalysis) {
      report += `**Файл:** ${prismaAnalysis.file}\n`;
      report += `**Модели:** ${prismaAnalysis.models} (${prismaAnalysis.modelNames.join(', ')})\n`;
      if (prismaAnalysis.issues.length > 0) {
        report += `**Проблемы:**\n${prismaAnalysis.issues.map(i => `- ${i}\n`).join('')}`;
      }
    }
    report += `\n`;

    // 2. API Endpoints
    report += `## 🚀 API ENDPOINTS (${structure.api.length})\n\n`;
    const apiAnalysis = this.analyzeApiEndpoints(structure.api);
    apiAnalysis.forEach(api => {
      report += `### ${api.endpoint}\n`;
      report += `**Методы:** ${api.methods.join(', ')}\n`;
      report += `**Функции:** ${api.functions.join(', ')}\n`;
      report += `**Файл:** ${api.path}\n`;
      if (api.issues.length > 0) {
        report += `**⚠️ Проблемы:**\n${api.issues.map(i => `  - ${i}\n`).join('')}`;
      }
      report += `\n`;
    });

    // 3. React Компоненты
    report += `## ⚛️ REACT КОМПОНЕНТЫ (${structure.components.length})\n\n`;
    const componentsAnalysis = this.analyzeComponents(structure.components);
    componentsAnalysis.forEach(comp => {
      report += `### ${comp.name}\n`;
      report += `**Тип:** ${comp.type}\n`;
      report += `**Путь:** ${comp.path}\n`;
      if (comp.props.length > 0) {
        report += `**Props:** ${comp.props.slice(0, 5).join(', ')}${comp.props.length > 5 ? '...' : ''}\n`;
      }
      if (comp.hooks.length > 0) {
        report += `**Hooks:** ${comp.hooks.join(', ')}\n`;
      }
      if (comp.issues.length > 0) {
        report += `**⚠️ Проблемы:**\n${comp.issues.map(i => `  - ${i}\n`).join('')}`;
      }
      report += `\n`;
    });

    // 4. Страницы
    report += `## 📄 СТРАНИЦЫ (${structure.pages.length})\n\n`;
    const pagesAnalysis = this.analyzePages(structure.pages);
    pagesAnalysis.forEach(page => {
      report += `### ${page.route}\n`;
      report += `**Файл:** ${page.path}\n`;
      if (page.components.length > 0) {
        report += `**Компоненты:** ${page.components.join(', ')}\n`;
      }
      if (page.dataFetching.length > 0) {
        report += `**Data Fetching:** ${page.dataFetching.join(', ')}\n`;
      }
      if (page.issues.length > 0) {
        report += `**⚠️ Проблемы:**\n${page.issues.map(i => `  - ${i}\n`).join('')}`;
      }
      report += `\n`;
    });

    // 5. Библиотеки и утилиты
    report += `## 🛠️ БИБЛИОТЕКИ И УТИЛИТЫ (${structure.lib.length})\n\n`;
    structure.lib.forEach(lib => {
      report += `- **${lib.name}** - ${lib.relativePath}\n`;
    });
    report += `\n`;

    // 6. Рекомендации
    report += `## 💡 РЕКОМЕНДАЦИИ И ВЫВОДЫ\n\n`;
    
    // Автоматические рекомендации на основе анализа
    if (apiAnalysis.some(api => api.issues.length > 0)) {
      report += `### 🔧 API Improvements:\n`;
      report += `- Добавить обработку ошибок во всех endpoints\n`;
      report += `- Валидация входных данных\n`;
      report += `- Правильные HTTP статусы\n\n`;
    }

    if (componentsAnalysis.some(comp => comp.issues.length > 0)) {
      report += `### ⚛️ Component Improvements:\n`;
      report += `- Добавить key props в .map() рендеринг\n`;
      report += `- Проверить обработку async событий\n`;
      report += `- Оптимизировать re-renders\n\n`;
    }

    report += `### 🎯 Next Steps:\n`;
    report += `1. Исправить критические проблемы (❌)\n`;
    report += `2. Рассмотреть предупреждения (⚠️)\n`;
    report += `3. Протестировать основные user flows\n`;
    report += `4. Оптимизировать производительность\n`;

    // Сохраняем файл
    const outputPath = path.join(__dirname, 'FULL_PROJECT_ANALYSIS.txt');
    fs.writeFileSync(outputPath, report, 'utf8');
    
    console.log('✅ Полный анализ сохранен в:', outputPath);
    console.log('📊 Итоговая статистика:');
    console.log(`   Prisma: ${structure.prisma.length} файлов`);
    console.log(`   API: ${structure.api.length} endpoints`);
    console.log(`   Components: ${structure.components.length} компонентов`);
    console.log(`   Pages: ${structure.pages.length} страниц`);
    console.log(`   Lib: ${structure.lib.length} утилит`);

    return report;
  }
}

// Запуск анализа
const analyzer = new DeepProjectAnalyzer();
analyzer.generateFullReport();