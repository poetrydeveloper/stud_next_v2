// /app/inventory/3d-view/components/CategoryCube.tsx

import { useRef, useMemo } from 'react'
import { Mesh } from 'three'
import { Text } from '@react-three/drei'
import { CategoryCube as CategoryCubeType } from '../types/inventory3d'

interface CategoryCubeProps {
  category: CategoryCubeType
  onClick?: (category: CategoryCubeType, event: any) => void
  onHover?: (type: string, name: string, isHovered: boolean) => void
  isSelected?: boolean
}

export const CategoryCube = ({ 
  category, 
  onClick, 
  onHover, 
  isSelected = false 
}: CategoryCubeProps) => {
  const meshRef = useRef<Mesh>(null)

  // Адаптивный размер текста
  const textScale = useMemo(() => 
    Math.min(0.3, category.size.x * 0.08), 
    [category.size.x]
  )

  const handleClick = (event: any) => {
    event.stopPropagation()
    onClick?.(category, event)
  }

  const handlePointerEnter = () => {
    onHover?.('category', category.name, true)
  }

  const handlePointerLeave = () => {
    onHover?.('category', '', false)
  }

  return (
    <group>
      {/* Основной куб категории */}
      <mesh
        ref={meshRef}
        position={[category.position.x, category.position.y, category.position.z]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[category.size.x, category.size.y, category.size.z]} />
        <meshStandardMaterial 
          color={isSelected ? '#ffff00' : category.color}
          transparent 
          opacity={isSelected ? 0.6 : 0.3}
          emissive={isSelected ? '#ffff00' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Контур выделения */}
      {isSelected && (
        <mesh 
          position={[category.position.x, category.position.y, category.position.z]}
        >
          <boxGeometry args={[
            category.size.x + 0.2, 
            category.size.y + 0.2, 
            category.size.z + 0.2
          ]} />
          <meshBasicMaterial 
            color="#ffff00" 
            transparent 
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}

      {/* Текст названия категории */}
      <Text
        position={[
          category.position.x, 
          category.position.y + category.size.y / 2 + 0.3, 
          category.position.z
        ]}
        fontSize={textScale}
        color={isSelected ? '#ffff00' : 'white'}
        anchorX="center"
        anchorY="middle"
        maxWidth={category.size.x - 0.5}
        font="/fonts/inter-regular.woff" // Опционально: кастомный шрифт
      >
        {category.name}
      </Text>

      {/* Счетчик товаров в категории */}
      {category.spines.length > 0 && (
        <Text
          position={[
            category.position.x, 
            category.position.y + category.size.y / 2 + 0.6, 
            category.position.z
          ]}
          fontSize={textScale * 0.7}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          {category.spines.length} spines
        </Text>
      )}
    </group>
  )
}