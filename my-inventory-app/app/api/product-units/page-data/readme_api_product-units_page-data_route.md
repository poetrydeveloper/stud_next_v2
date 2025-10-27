 Роут: /api/product-units/page-data
🎯 Назначение
Получение данных для отображения страницы товарных единиц с древовидной структурой категорий.

🔧 Метод
GET /api/product-units/page-data
Назначение: Получение полной структуры данных для построения дерева категорий → Spine → ProductUnit

🗂 Структура данных
Категории (Categories)
typescript
{
  id: number;
  name: string;
  human_path: string;
  spines: SpineWithUnits[];
}
Spine с юнитами
typescript
{
  id: number;
  name: string;
  productUnits: ProductUnit[];
}
ProductUnit с продуктом
typescript
{
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct?: string;
  product: {
    name: string;
    code: string;
    images: ProductImage[]; // только isMain: true
    brand: { name: string };
  }
}
🔄 Логика работы
Загружает все категории с вложенными данными

Включает Spine каждой категории

Включает ProductUnit каждого Spine

Включает Product каждого юнита с:

Главным изображением (isMain: true)

Брендом

Сортирует категории по human_path (человеко-читаемый путь)

Считает статистику:

Общее количество юнитов

Количество кандидатов (statusCard: "CANDIDATE")

Количество категорий

Количество Spine

📊 Возвращаемые данные
✅ Успешный ответ:
json
{
  "ok": true,
  "categories": [/* массив категорий со Spine и ProductUnit */],
  "totalUnits": number,
  "candidateUnits": number, 
  "totalCategories": number,
  "totalSpines": number
}
❌ Ошибка:
json
{
  "ok": false,
  "error": "Failed to load data"
}
⚡ Особенности
Оптимизированные запросы: Один запрос к БД с включениями

Только главные изображения: Фильтр isMain: true для изображений

Человеко-читаемая сортировка: По human_path вместо ID

Готовая структура: Данные уже сгруппированы для фронтенда

⚠️ Проблемы и замечания
Производительность:

Может быть тяжело при большом количестве категорий/Spine

Нет пагинации - загружает все данные сразу

Отсутствие фильтрации:

Всегда возвращает все юниты независимо от статуса

Нет возможности фильтровать по статусам card/product

Ограничения:

Только для построения дерева на странице /product-units

Не подходит для других сценариев использования

Следующий роут? Покажите любой другой API endpoint для анализа.