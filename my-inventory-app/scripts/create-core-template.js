// scripts/create-core-template.js
const fs = require('fs');
const path = require('path');

const template = {
  "Supplier": [
    {
      "name": "Основной поставщик",
      "id": 1
    }
  ],
  "Brand": [
    {
      "name": "Пример бренда",
      "slug": "primer-brenda",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "id": 1
    }
  ],
  "Category": [
    {
      "name": "Пример категории",
      "slug": "primer-kategorii", 
      "path": "/primer-kategorii",
      "id": 1
    }
  ],
  "User": [],
  "Customer": [],
  "Spine": [],
  "Product": [],
  "ProductImage": []
};

const CORE_DIR = path.join(process.cwd(), 'core-data');

if (!fs.existsSync(CORE_DIR)) {
  fs.mkdirSync(CORE_DIR, { recursive: true });
}

fs.writeFileSync(
  path.join(CORE_DIR, 'core-template.json'), 
  JSON.stringify(template, null, 2),
  'utf8'
);

console.log('✅ Шаблон ядра создан: core-data/core-template.json');