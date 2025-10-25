// /app/inventory/3d-view/components/Scene3D.tsx

import { OrbitControls, Environment } from '@react-three/drei'
import { CameraController } from './CameraController'
import { CategoryCube } from './CategoryCube'
import { SpineCube } from './SpineCube'
import { ProductUnitCube } from './ProductUnitCube'
import { RequestLines } from './RequestLines'
import { SalesPlane } from './SalesPlane'
import { ProductUnitCube as ProductUnitType, CategoryCube as CategoryCubeType, SpineCube as SpineCubeType } from '../types/inventory3d'

interface Scene3DProps {
  categories: CategoryCubeType[]
  spines: SpineCubeType[]
  productUnits: ProductUnitType[]
  requestLines: any[]
  salesPlane: any
  onUnitClick: (unit: ProductUnitType, event: any) => void
  onCategoryClick: (category: CategoryCubeType, event: any) => void
  onSpineClick: (spine: SpineCubeType, event: any) => void
  onObjectHover: (type: string, name: string, isHovered: boolean) => void
  selectedUnit: ProductUnitType | null
  selectedCategory: CategoryCubeType | null
  selectedSpine: SpineCubeType | null
}

export const Scene3D = ({
  categories,
  spines,
  productUnits,
  requestLines,
  salesPlane,
  onUnitClick,
  onCategoryClick,
  onSpineClick,
  onObjectHover,
  selectedUnit,
  selectedCategory,
  selectedSpine
}: Scene3DProps) => {
  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      
      {/* Освещение */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#0099ff" />
      
      {/* Контроллер камеры */}
      <CameraController />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={100}
        minDistance={5}
        target={[0, 0, 0]}
      />
      
      {/* Окружение */}
      <Environment preset="night" />
      
      {/* Сетка для ориентира */}
      <gridHelper args={[50, 50, '#444444', '#222222']} rotation={[-Math.PI / 2, 0, 0]} />
      
      {/* Оси координат */}
      <axesHelper args={[5]} />
      
      {/* Категории */}
      {categories.map(category => (
        <CategoryCube 
          key={category.id} 
          category={category}
          onClick={onCategoryClick}
          onHover={onObjectHover}
          isSelected={selectedCategory?.id === category.id}
        />
      ))}
      
      {/* Spines */}
      {spines.map(spine => (
        <SpineCube 
          key={spine.id} 
          spine={spine}
          onClick={onSpineClick}
          onHover={onObjectHover}
          isSelected={selectedSpine?.id === spine.id}
        />
      ))}
      
      {/* Product Units */}
      {productUnits.map(unit => (
        <ProductUnitCube 
          key={unit.id} 
          unit={unit} 
          onClick={onUnitClick}
          onHover={onObjectHover}
          isSelected={selectedUnit?.id === unit.id}
        />
      ))}
      
      {/* Нити поставок */}
      <RequestLines lines={requestLines} />
      
      {/* Плоскость продаж */}
      <SalesPlane 
        salesPlane={salesPlane}
        onUnitClick={onUnitClick}
        onHover={onObjectHover}
      />
    </>
  )
}