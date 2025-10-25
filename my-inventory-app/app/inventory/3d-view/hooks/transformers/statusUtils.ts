// // /app/inventory/3d-view/hooks/transformers/statusUtils.ts

// export type VisualStatus = 
//   | 'IN_STORE_AVAILABLE'
//   | 'IN_REQUEST'
//   | 'IN_DELIVERY'
//   | 'SOLD'
//   | 'CREDIT'
//   | 'HIDDEN'

// export const calculateVisualStatus = (unit: any): VisualStatus => {
//   const { cardStatus, physicalStatus, disassemblyStatus } = unit

//   // Скрываем ненужные статусы
//   if (disassemblyStatus === 'DISASSEMBLED' || disassemblyStatus === 'COLLECTED') return 'HIDDEN'
//   if (cardStatus === 'SPROUTED') return 'HIDDEN'

//   // Определяем видимые статусы
//   if (cardStatus === 'IN_REQUEST') return 'IN_REQUEST'
//   if (cardStatus === 'IN_DELIVERY') return 'IN_DELIVERY'
//   if (physicalStatus === 'SOLD') return 'SOLD'
//   if (physicalStatus === 'CREDIT') return 'CREDIT'
//   if (cardStatus === 'ARRIVED' && physicalStatus === 'IN_STORE') return 'IN_STORE_AVAILABLE'

//   return 'HIDDEN'
// }

// export const getColorByStatus = (status: VisualStatus): string => {
//   switch (status) {
//     case 'IN_STORE_AVAILABLE': return '#666666'
//     case 'IN_REQUEST': return '#0099ff'
//     case 'IN_DELIVERY': return '#00aaff'
//     case 'SOLD': return '#333333'
//     case 'CREDIT': return '#553333'
//     default: return '#666666'
//   }
// }

// export const shouldPulse = (unit: any): boolean => {
//   if (unit.cardStatus === 'ARRIVED' && unit.physicalStatus === 'IN_STORE') {
//     return Math.random() < 0.1
//   }
//   return false
// }
// /app/inventory/3d-view/hooks/transformers/statusUtils.ts

export type VisualStatus = 
  | 'IN_STORE_AVAILABLE'
  | 'IN_REQUEST'
  | 'IN_DELIVERY'
  | 'SOLD'
  | 'CREDIT'
  | 'HIDDEN'

export const calculateVisualStatus = (unit: any): VisualStatus => {
  const { cardStatus, physicalStatus, disassemblyStatus } = unit

  // Скрываем ненужные статусы
  if (disassemblyStatus === 'DISASSEMBLED' || disassemblyStatus === 'COLLECTED') return 'HIDDEN'
  if (cardStatus === 'SPROUTED') return 'HIDDEN'

  // Определяем видимые статусы
  if (cardStatus === 'IN_REQUEST') return 'IN_REQUEST'
  if (cardStatus === 'IN_DELIVERY') return 'IN_DELIVERY'
  if (physicalStatus === 'SOLD') return 'SOLD'
  if (physicalStatus === 'CREDIT') return 'CREDIT'
  if (cardStatus === 'ARRIVED' && physicalStatus === 'IN_STORE') return 'IN_STORE_AVAILABLE'

  return 'HIDDEN'
}

export const getColorByStatus = (status: VisualStatus): string => {
  switch (status) {
    case 'IN_STORE_AVAILABLE': return '#666666'
    case 'IN_REQUEST': return '#0099ff'
    case 'IN_DELIVERY': return '#00aaff'
    case 'SOLD': return '#333333'
    case 'CREDIT': return '#553333'
    default: return '#666666'
  }
}

export const shouldPulse = (unit: any): boolean => {
  if (unit.cardStatus === 'ARRIVED' && unit.physicalStatus === 'IN_STORE') {
    return Math.random() < 0.1
  }
  return false
}