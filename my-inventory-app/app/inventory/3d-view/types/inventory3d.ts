export interface ProductUnitCube {
  id: number
  serialNumber: string
  productId: number
  productName: string
  brandName: string
  price: number
  
  // ОСНОВНЫЕ СТАТУСЫ ДЛЯ ВИЗУАЛИЗАЦИИ
  position: Vector3
  size: Vector3
  color: string
  pulse: boolean
  
  // СТАТУСЫ ИЗ PRISMA
  disassemblyStatus: 'MONOLITH' | 'DISASSEMBLED' | 'PARTIAL' | 'COLLECTED' | 'RESTORED'
  cardStatus: 'CLEAR' | 'CANDIDATE' | 'SPROUTED' | 'IN_REQUEST' | 'IN_DELIVERY' | 'ARRIVED'
  physicalStatus: 'IN_STORE' | 'SOLD' | 'CREDIT' | 'LOST' | 'IN_DISASSEMBLED' | 'IN_COLLECTED'
  
  spineId: number
}

// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ДЛЯ ЛОГИКИ
export type VisualStatus = 
  | 'IN_STORE_AVAILABLE'     // В магазине, можно продавать
  | 'IN_STORE_FROZEN'        // В магазине, но заморожен (DISASSEMBLED/COLLECTED)
  | 'IN_REQUEST'             // Заказан, в пути
  | 'IN_DELIVERY'            // Поставляется
  | 'SOLD'                   // Продан
  | 'CREDIT'                 // Продан в кредит
  | 'LOST'                   // Потерян
  | 'DISASSEMBLED_PARENT'    // Родитель разобранного набора
  | 'DISASSEMBLED_CHILD'     // Дочерний элемент разбора