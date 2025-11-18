// components/miller-columns/types.ts - ОБНОВЛЕННАЯ ВЕРСИЯ С ЭФФЕКТОМ СМИНАНИЯ
export type Category = {
  id: number
  name: string
  slug: string
  path: string
  node_index: string | null
  human_path: string | null
  _count?: {
    children: number
    products: number
    spines: number
  }
  hasChildren?: boolean
  categoryId?: number // для обратной совместимости
}

export type Spine = {
  id: number
  name: string
  slug: string
  node_index: string | null
  human_path: string | null
  imagePath: string | null
  categoryId: number
  _count?: {
    products: number
    productUnits: number
  }
  hasChildren?: boolean
}

export type Product = {
  id: number
  code: string
  name: string
  description?: string
  brand?: {
    id: number
    name: string
    slug: string
  }
  productUnits?: Array<{
    id: number
    statusCard: string
    statusProduct: string
    createdAt: string
  }>
  _count?: {
    productUnits: number
  }
  statusCounts?: Record<string, number>
  spineId?: number
  categoryId?: number
}

export type ColumnItem = {
  type: 'category' | 'spine' | 'product'
  data: Category | Spine | Product
}

export interface CellProps<T> {
  item: T
  onClick: () => void
  isSelected: boolean
  showChildrenIndicator?: boolean
  isCollapsed?: boolean // ← ДОБАВЛЯЕМ ДЛЯ ЭФФЕКТА СМИНАНИЯ
}