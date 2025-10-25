// /app/inventory/3d-view/types/inventory3d.ts

export interface ProductUnitCube {
  id: number
  serialNumber: string
  productId: number
  productName: string
  brandName: string
  price: number
  
  // СТАТУСЫ ИЗ PRISMA
  disassemblyStatus: 'MONOLITH' | 'DISASSEMBLED' | 'PARTIAL' | 'COLLECTED' | 'RESTORED'
  cardStatus: 'CLEAR' | 'CANDIDATE' | 'SPROUTED' | 'IN_REQUEST' | 'IN_DELIVERY' | 'ARRIVED'
  physicalStatus: 'IN_STORE' | 'SOLD' | 'CREDIT' | 'LOST' | 'IN_DISASSEMBLED' | 'IN_COLLECTED'
  
  // ВИЗУАЛЬНЫЕ СВОЙСТВА
  position: Vector3
  size: Vector3
  color: string
  pulse: boolean // Пульсация при малых остатках
  quantity: number // Количество для расчета пульсации
  
  spineId: number
}

// ВЫЧИСЛЯЕМЫЙ ВИЗУАЛЬНЫЙ СТАТУС
export type VisualStatus = 
  | 'IN_STORE_AVAILABLE'     // ARRIVED + IN_STORE + (MONOLITH/RESTORED/PARTIAL)
  | 'IN_REQUEST'             // IN_REQUEST + null + null
  | 'IN_DELIVERY'            // IN_DELIVERY + null + null  
  | 'SOLD'                   // ARRIVED + SOLD + (MONOLITH/RESTORED/PARTIAL)
  | 'CREDIT'                 // ARRIVED + CREDIT + (MONOLITH/RESTORED/PARTIAL)
  | 'HIDDEN'                 // DISASSEMBLED/COLLECTED/SPROUTED - не отображаем