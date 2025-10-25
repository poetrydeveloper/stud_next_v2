// /app/inventory/3d-view/components/OverlayUI.tsx

import { ProductUnitCube as ProductUnitType, CategoryCube as CategoryCubeType, SpineCube as SpineCubeType } from '../types/inventory3d'

interface OverlayUIProps {
  hoveredObject: { type: string; name: string } | null
  selectedUnit: ProductUnitType | null
  selectedCategory: CategoryCubeType | null
  selectedSpine: SpineCubeType | null
}

export const OverlayUI = ({ 
  hoveredObject, 
  selectedUnit, 
  selectedCategory, 
  selectedSpine 
}: OverlayUIProps) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 10
    }}>
      {/* Ховер подсказка */}
      {hoveredObject && (
        <div style={{
          position: 'absolute',
          top: 50,
          left: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          pointerEvents: 'none'
        }}>
          {hoveredObject.type}: {hoveredObject.name}
        </div>
      )}

      {/* Информация о выделенном объекте */}
      {selectedUnit && (
        <SelectedUnitInfo unit={selectedUnit} />
      )}

      {selectedCategory && (
        <SelectedCategoryInfo category={selectedCategory} />
      )}

      {selectedSpine && (
        <SelectedSpineInfo spine={selectedSpine} />
      )}
    </div>
  )
}

const SelectedUnitInfo = ({ unit }: { unit: ProductUnitType }) => (
  <div style={{
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '300px',
    pointerEvents: 'none'
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#0099ff' }}>Товар</h3>
    <p><strong>Бренд:</strong> {unit.brandName}</p>
    <p><strong>Продукт:</strong> {unit.productName}</p>
    <p><strong>Серийный номер:</strong> {unit.serialNumber}</p>
    <p><strong>Цена:</strong> ${unit.price}</p>
    <p><strong>Статус:</strong> {unit.physicalStatus}</p>
  </div>
)

const SelectedCategoryInfo = ({ category }: { category: CategoryCubeType }) => (
  <div style={{
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '300px',
    pointerEvents: 'none'
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>Категория</h3>
    <p><strong>Название:</strong> {category.name}</p>
    <p><strong>Путь:</strong> {category.path}</p>
    <p><strong>Spines:</strong> {category.spines.length}</p>
  </div>
)

const SelectedSpineInfo = ({ spine }: { spine: SpineCubeType }) => (
  <div style={{
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '15px',
    borderRadius: '8px',
    minWidth: '300px',
    pointerEvents: 'none'
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#ffaa00' }}>Spine</h3>
    <p><strong>Название:</strong> {spine.name}</p>
    <p><strong>Slug:</strong> {spine.slug}</p>
    <p><strong>Товаров:</strong> {spine.productUnits.length}</p>
  </div>
)