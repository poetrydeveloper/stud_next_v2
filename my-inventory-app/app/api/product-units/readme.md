ОСНОВНЫЕ CRUD ✅
Метод	Endpoint	Назначение
GET	/api/product-units	Список юнитов с фильтрами
PATCH	/api/product-units	CLEAR → CANDIDATE
POST	/api/product-units/create	Создать новый юнит
🔄 СТАТУСНЫЕ TRANSITIONS ✅
Метод	Endpoint	Переход
POST	/api/product-units/request	CANDIDATE → IN_REQUEST (одиночная)
POST	/api/product-units/[id]/sprout	CANDIDATE → SPROUTED (множественная)
PATCH	/api/product-units/[id]/delivery	IN_REQUEST → IN_DELIVERY → ARRIVED → IN_STORE
PATCH	/api/product-units/[id]/sale	IN_STORE → SOLD/CREDIT
PATCH	/api/product-units/[id]/return	SOLD/CREDIT → IN_STORE (возврат)
POST	/api/product-units/[id]/toggle-candidate	CLEAR ↔ CANDIDATE (переключение)
POST	/api/product-units/revert-to-request	IN_STORE → IN_REQUEST (откат)
📊 ВСПОМОГАТЕЛЬНЫЕ ✅
Метод	Endpoint	Назначение
GET	/api/product-units/[id]/logs	Логи юнита
GET	/api/product-units/search	Поиск юнитов
