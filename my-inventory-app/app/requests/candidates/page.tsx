// app/requests/candidates/page.tsx
"use client";

import { useEffect, useState } from "react";

type Status = "CANDIDATE" | "IN_REQUEST" | "EXTRA";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string | null;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
}

interface ProductImage {
  path: string;
  isMain: boolean;
}

interface Product {
  id: number;
  code: string;
  name: string;
  images: ProductImage[];
}

interface Item {
  id: number;
  status: Status;
  quantity: number;
  deliveredQuantity: number;
  pricePerUnit: string;
  supplierId: number | null;
  supplier: Supplier | null;
  customerId: number | null;
  customer: Customer | null;
  product: Product;
  deliveryProgress: string;
  remainingQuantity: number;
  totalCost: string;
}

export default function CandidatesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  // Функция для безопасного преобразования данных в массив
  const ensureArray = <T,>(data: any): T[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') return Object.values(data);
    return [];
  };

  // Функция для генерации уникального ключа
  const generateUniqueKey = (item: any, index: number): string => {
    if (item && item.id !== undefined && item.id !== null) {
      return `customer-${item.id}`;
    }
    return `customer-index-${index}`;
  };

  // Загрузка всех данных
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [itemsRes, suppliersRes, customersRes] = await Promise.all([
        fetch("/api/request-items?status=candidate"),
        fetch("/api/suppliers"),
        fetch("/api/customers")
      ]);

      // Проверка статусов ответов
      if (!itemsRes.ok) throw new Error(`Ошибка загрузки кандидатов: ${itemsRes.status}`);
      if (!suppliersRes.ok) throw new Error(`Ошибка загрузки поставщиков: ${suppliersRes.status}`);
      if (!customersRes.ok) throw new Error(`Ошибка загрузки заказчиков: ${customersRes.status}`);

      const [itemsData, suppliersData, customersData] = await Promise.all([
        itemsRes.json(),
        suppliersRes.json(),
        customersRes.json()
      ]);

      // Безопасное преобразование данных в массивы
      setItems(ensureArray<Item>(itemsData));
      setSuppliers(ensureArray<Supplier>(suppliersData));
      
      // Обработка customers с проверкой уникальности ID
      const customersArray = ensureArray<Customer>(customersData);
      console.log('Customers data:', customersArray);
      
      // Проверяем наличие дубликатов ID
      const uniqueIds = new Set();
      const customersWithUniqueIds = customersArray.map((customer, index) => {
        let customerId = customer.id;
        
        // Если ID отсутствует или дублируется, создаем временный уникальный ID
        if (customerId === undefined || customerId === null || uniqueIds.has(customerId)) {
          customerId = -index - 1; // Отрицательные ID для временных значений
        }
        
        uniqueIds.add(customerId);
        return { ...customer, id: customerId };
      });
      
      setCustomers(customersWithUniqueIds);
      
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      setError(err instanceof Error ? err.message : "Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Изменение статуса товара
  const moveTo = async (id: number, status: Status) => {
    try {
      setUpdatingIds(prev => [...prev, id]);
      
      const res = await fetch(`/api/request-items/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Не удалось изменить статус");
      }

      await loadData(); // Перезагружаем данные
    } catch (err) {
      console.error("Ошибка при изменении статуса:", err);
      alert(err instanceof Error ? err.message : "Не удалось изменить статус");
    } finally {
      setUpdatingIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Обновление поставщика для товара
  const updateSupplier = async (itemId: number, supplierId: number | null) => {
    try {
      setUpdatingIds(prev => [...prev, itemId]);
      
      // Валидация: проверяем что supplierId существует в списке поставщиков
      if (supplierId !== null && !suppliers.some(s => s.id === supplierId)) {
        throw new Error("Неверный ID поставщика");
      }

      const res = await fetch(`/api/request-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Не удалось обновить поставщика");
      }

      await loadData(); // Перезагружаем данные
    } catch (err) {
      console.error("Ошибка при обновлении поставщика:", err);
      alert(err instanceof Error ? err.message : "Не удалось обновить поставщика");
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== itemId));
    }
  };

  // Обновление заказчика для товара
  const updateCustomer = async (itemId: number, customerId: number | null) => {
    try {
      setUpdatingIds(prev => [...prev, itemId]);
      
      // Валидация: проверяем что customerId существует в списке заказчиков
      // Игнорируем временные отрицательные ID
      if (customerId !== null && customerId > 0 && !customers.some(c => c.id === customerId)) {
        throw new Error("Неверный ID заказчика");
      }

      // Для API отправляем только валидные положительные ID
      const apiCustomerId = customerId && customerId > 0 ? customerId : null;

      const res = await fetch(`/api/request-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: apiCustomerId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Не удалось обновить заказчика");
      }

      await loadData(); // Перезагружаем данные
    } catch (err) {
      console.error("Ошибка при обновлении заказчика:", err);
      alert(err instanceof Error ? err.message : "Не удалось обновить заказчика");
    } finally {
      setUpdatingIds(prev => prev.filter(id => id !== itemId));
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center text-red-500 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-4 py-2 rounded mx-auto block"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Предзаявки (кандидаты)</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Всего кандидатов: {items.length}
        </div>
        <button 
          onClick={loadData}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Обновить
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Товар</th>
              <th className="p-2 border">Код</th>
              <th className="p-2 border">Кол-во</th>
              <th className="p-2 border">Цена/ед</th>
              <th className="p-2 border">Итого</th>
              <th className="p-2 border">Поставщик</th>
              <th className="p-2 border">Заказчик</th>
              <th className="p-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const isUpdating = updatingIds.includes(it.id);
              
              return (
                <tr key={it.id} className={`hover:bg-gray-50 ${isUpdating ? 'opacity-50' : ''}`}>
                  <td className="p-2 border">{it.product.name}</td>
                  <td className="p-2 border">{it.product.code}</td>
                  <td className="p-2 border">{it.quantity}</td>
                  <td className="p-2 border">{it.pricePerUnit} ₽</td>
                  <td className="p-2 border font-semibold">{it.totalCost} ₽</td>
                  
                  {/* Выбор поставщика */}
                  <td className="p-2 border">
                    <select
                      value={it.supplierId || ""}
                      onChange={(e) => updateSupplier(
                        it.id, 
                        e.target.value ? parseInt(e.target.value) : null
                      )}
                      disabled={isUpdating}
                      className="w-full p-1 border rounded text-sm disabled:opacity-50"
                    >
                      <option value="">Неизвестный поставщик</option>
                      {Array.isArray(suppliers) && suppliers.map((supplier) => (
                        <option key={`supplier-${supplier.id}`} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Выбор заказчика */}
                  <td className="p-2 border">
                    <select
                      value={it.customerId || ""}
                      onChange={(e) => updateCustomer(
                        it.id,
                        e.target.value ? parseInt(e.target.value) : null
                      )}
                      disabled={isUpdating}
                      className="w-full p-1 border rounded text-sm disabled:opacity-50"
                    >
                      <option value="">Выберите заказчика</option>
                      {Array.isArray(customers) && customers.map((customer, index) => (
                        <option key={generateUniqueKey(customer, index)} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  
                  {/* Кнопки действий */}
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => moveTo(it.id, "IN_REQUEST")}
                      disabled={isUpdating}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Добавить в основную заявку"
                    >
                      {isUpdating ? "..." : "В заявку"}
                    </button>
                    <button
                      onClick={() => moveTo(it.id, "EXTRA")}
                      disabled={isUpdating}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Добавить в EXTRA-заявку"
                    >
                      {isUpdating ? "..." : "В EXTRA"}
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={8}>
                  Нет кандидатов для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Информация о выбранных значениях */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <p className="font-semibold">Информация:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Поставщик по умолчанию: "Неизвестный поставщик"</li>
          <li>Заказчик не выбран по умолчанию</li>
          <li>Изменения сохраняются автоматически</li>
        </ul>
      </div>
    </div>
  );
}