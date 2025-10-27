// обзорный_скрипт/analyze-project.js
const fs = require('fs');
const path = require('path');

class ProjectAnalyzer {
  constructor(rootDir = process.cwd()) {
    // Поднимаемся на уровень выше из папки скриптов
    this.rootDir = path.resolve(rootDir, '..');
    this.components = [];
    this.apiRoutes = [];
    this.pages = [];
  }

  // Рекурсивный поиск файлов с обработкой ошибок
  findFiles(dir, pattern, results = []) {
    try {
      // Проверяем существует ли директория
      if (!fs.existsSync(dir)) {
        console.log(`⚠️ Директория не существует: ${dir}`);
        return results;
      }

      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        try {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            // Пропускаем node_modules и скрытые папки
            if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next' && file !== 'V_SCRIPTS') {
              this.findFiles(filePath, pattern, results);
            }
          } else if (pattern.test(file)) {
            results.push({
              path: filePath,
              relativePath: path.relative(this.rootDir, filePath),
              name: file,
              type: this.getFileType(filePath)
            });
          }
        } catch (fileError) {
          console.log(`⚠️ Ошибка при обработке файла ${file}:`, fileError.message);
        }
      }
    } catch (dirError) {
      console.log(`❌ Ошибка при чтении директории ${dir}:`, dirError.message);
    }
    
    return results;
  }

  getFileType(filePath) {
    if (filePath.includes('/api/')) return 'api';
    if (filePath.includes('/components/')) return 'component';
    if (filePath.includes('/app/') && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) return 'page';
    if (filePath.includes('/lib/')) return 'lib';
    return 'other';
  }

  // Чтение содержимого файла
  readFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return `❌ Ошибка чтения файла: ${error.message}`;
    }
  }

  // Поиск README файлов
  findReadmeFiles() {
    return this.findFiles(this.rootDir, /readme_.*\.md$/i);
  }

  // Анализ API роутов
  analyzeApiRoutes() {
    const apiDir = path.join(this.rootDir, 'app', 'api');
    console.log(`🔍 Ищем API в: ${apiDir}`);
    
    if (!fs.existsSync(apiDir)) {
      console.log('❌ Папка API не найдена');
      return [];
    }

    const routes = this.findFiles(apiDir, /route\.(ts|js)$/);
    console.log(`📡 Найдено API роутов: ${routes.length}`);
    
    return routes.map(route => {
      const content = this.readFileContent(route.path);
      return {
        ...route,
        methods: this.extractMethods(content),
        endpoints: this.extractEndpoints(route.relativePath),
        summary: this.generateApiSummary(content)
      };
    });
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

  extractEndpoints(relativePath) {
    // Преобразуем путь к роуту в endpoint
    return relativePath
      .replace(/^app\/api\//, '/api/')
      .replace(/\/route\.(ts|js)$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1');
  }

  generateApiSummary(content) {
    // Простой анализ для генерации краткого описания
    if (content.includes('CANDIDATE') && content.includes('IN_REQUEST')) {
      return 'Управление кандидатами и заявками';
    }
    if (content.includes('SOLD') && content.includes('CREDIT')) {
      return 'Продажи и кредитные операции';
    }
    if (content.includes('IN_STORE') && content.includes('statusProduct')) {
      return 'Управление складскими статусами';
    }
    if (content.includes('createRequest') || content.includes('RequestService')) {
      return 'Создание заявок на товары';
    }
    return 'API endpoint';
  }

  // Анализ компонентов
  analyzeComponents() {
    const componentsDir = path.join(this.rootDir, 'app', 'components');
    console.log(`🔍 Ищем компоненты в: ${componentsDir}`);
    
    if (!fs.existsSync(componentsDir)) {
      console.log('❌ Папка components не найдена');
      return [];
    }

    const components = this.findFiles(componentsDir, /\.(tsx|jsx)$/);
    console.log(`⚛️ Найдено компонентов: ${components.length}`);
    
    return components.map(component => {
      const content = this.readFileContent(component.path);
      return {
        ...component,
        props: this.extractProps(content),
        hooks: this.extractHooks(content),
        summary: this.generateComponentSummary(content)
      };
    });
  }

  extractProps(content) {
    const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]*)}/);
    if (!propsMatch) return [];
    
    const propsContent = propsMatch[2];
    const propLines = propsContent.split('\n')
      .filter(line => line.includes(':') && !line.includes('//'))
      .map(line => line.trim().split(':')[0].trim());
    
    return propLines;
  }

  extractHooks(content) {
    const hooks = [];
    if (content.includes('useState')) hooks.push('useState');
    if (content.includes('useEffect')) hooks.push('useEffect');
    if (content.includes('useContext')) hooks.push('useContext');
    if (content.includes('useRouter')) hooks.push('useRouter');
    return hooks;
  }

  generateComponentSummary(content) {
    if (content.includes('ProductUnit') && content.includes('statusCard')) {
      return 'Компонент для работы с товарными единицами';
    }
    if (content.includes('CategoryTree') || content.includes('Spine')) {
      return 'Компонент древовидной структуры категорий';
    }
    if (content.includes('Modal') && content.includes('Request')) {
      return 'Модальное окно для создания заявок';
    }
    if (content.includes('Inventory') && content.includes('heatmap')) {
      return 'Компонент тепловой карты остатков';
    }
    return 'React компонент';
  }

  // Главный метод анализа
  analyze() {
    console.log('🔍 Начинаем анализ проекта...');
    console.log(`📁 Корневая директория: ${this.rootDir}`);
    
    this.readmeFiles = this.findReadmeFiles();
    this.apiRoutes = this.analyzeApiRoutes();
    this.components = this.analyzeComponents();
    
    // Ищем страницы в app directory
    const appDir = path.join(this.rootDir, 'app');
    this.pages = this.findFiles(appDir, /page\.(tsx|jsx)$/);

    console.log('✅ Анализ завершен:');
    console.log(`   📚 README файлов: ${this.readmeFiles.length}`);
    console.log(`   🚀 API роутов: ${this.apiRoutes.length}`);
    console.log(`   ⚛️  Компонентов: ${this.components.length}`);
    console.log(`   📄 Страниц: ${this.pages.length}`);

    return this;
  }
}

module.exports = ProjectAnalyzer;