// обзорный_скрипт/diagnostic-scanner.js
const fs = require('fs');
const path = require('path');

class DiagnosticScanner {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    console.log('🔍 Диагностика структуры проекта...');
    console.log('📁 Корневая директория:', this.rootDir);
  }

  scanProjectStructure() {
    let report = `# 🔍 ДИАГНОСТИКА СТРУКТУРЫ ПРОЕКТА\n\n`;
    report += `Время: ${new Date().toLocaleString('ru-RU')}\n`;
    report += `Корень: ${this.rootDir}\n\n`;

    // 1. Проверяем существование корневой директории
    if (!fs.existsSync(this.rootDir)) {
      report += `❌ Корневая директория не существует!\n`;
      return report;
    }

    report += `✅ Корневая директория существует\n\n`;

    // 2. Сканируем все папки и файлы первого уровня
    report += `## 📂 СОДЕРЖИМОЕ КОРНЕВОЙ ДИРЕКТОРИИ\n\n`;
    
    try {
      const rootItems = fs.readdirSync(this.rootDir);
      
      rootItems.forEach(item => {
        const itemPath = path.join(this.rootDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          report += `📁 ${item}/\n`;
          // Показываем содержимое важных папок
          if (['app', 'components', 'api', 'lib', 'prisma'].includes(item)) {
            report += this.scanDirectoryContents(itemPath, 1);
          }
        } else {
          report += `📄 ${item}\n`;
        }
      });
    } catch (error) {
      report += `❌ Ошибка чтения корневой директории: ${error.message}\n`;
    }

    // 3. Ищем специфические папки
    report += `\n## 🔎 ПОИСК КЛЮЧЕВЫХ ПАПОК\n\n`;
    
    const keyFolders = [
      'app', 'app/api', 'app/components', 'app/lib', 'prisma',
      'components', 'pages', 'src', 'lib'
    ];

    keyFolders.forEach(folder => {
      const folderPath = path.join(this.rootDir, folder);
      if (fs.existsSync(folderPath)) {
        report += `✅ Найдена: ${folder}/\n`;
        report += this.scanDirectoryContents(folderPath, 2);
      } else {
        report += `❌ Не найдена: ${folder}/\n`;
      }
    });

    // 4. Ищем все .tsx, .ts, .jsx, .js файлы
    report += `\n## 📊 СТАТИСТИКА ФАЙЛОВ\n\n`;
    
    const fileTypes = {
      '.tsx': this.findFilesByExtension('.tsx'),
      '.ts': this.findFilesByExtension('.ts'), 
      '.jsx': this.findFilesByExtension('.jsx'),
      '.js': this.findFilesByExtension('.js'),
      '.prisma': this.findFilesByExtension('.prisma'),
      '.md': this.findFilesByExtension('.md')
    };

    Object.entries(fileTypes).forEach(([ext, files]) => {
      report += `${ext}: ${files.length} файлов\n`;
      if (files.length > 0 && files.length <= 10) {
        files.slice(0, 5).forEach(file => {
          report += `  - ${file}\n`;
        });
        if (files.length > 5) report += `  - ... и еще ${files.length - 5} файлов\n`;
      }
    });

    // 5. Сохраняем отчет
    const outputPath = path.join(__dirname, 'PROJECT_STRUCTURE_DIAGNOSTIC.txt');
    fs.writeFileSync(outputPath, report, 'utf8');
    
    console.log('✅ Диагностика завершена. Файл:', outputPath);
    return report;
  }

  scanDirectoryContents(dirPath, maxDepth = 2, currentDepth = 0) {
    if (currentDepth >= maxDepth) return '';

    let contents = '';
    
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        const indent = '  '.repeat(currentDepth + 1);
        
        if (stat.isDirectory()) {
          contents += `${indent}📁 ${item}/\n`;
          if (currentDepth < maxDepth - 1) {
            contents += this.scanDirectoryContents(itemPath, maxDepth, currentDepth + 1);
          }
        } else {
          contents += `${indent}📄 ${item}\n`;
        }
      });
    } catch (error) {
      contents += `${'  '.repeat(currentDepth + 1)}❌ Ошибка чтения: ${error.message}\n`;
    }
    
    return contents;
  }

  findFilesByExtension(extension) {
    const files = [];
    this._findFilesByExt(this.rootDir, extension, files);
    return files.map(f => path.relative(this.rootDir, f));
  }

  _findFilesByExt(dir, extension, results) {
    try {
      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        try {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            if (!item.startsWith('.') && !['node_modules', '.next', '.git'].includes(item)) {
              this._findFilesByExt(itemPath, extension, results);
            }
          } else if (item.endsWith(extension)) {
            results.push(itemPath);
          }
        } catch (e) {
          // Пропускаем ошибки
        }
      });
    } catch (e) {
      // Пропускаем ошибки директорий
    }
  }
}

// Запускаем диагностику
const scanner = new DiagnosticScanner();
scanner.scanProjectStructure();