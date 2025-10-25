// /app/inventory/3d-view/components/ProductUnitCube.tsx

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { Text } from '@react-three/drei'
import { ProductUnitCube as ProductUnitType } from '../types/inventory3d'

interface ProductUnitCubeProps {
  unit: ProductUnitType
  onClick: (unit: ProductUnitType) => void
  isSelected: boolean
}

export const ProductUnitCube = ({ unit, onClick, isSelected }: ProductUnitCubeProps) => {
  const meshRef = useRef<Mesh>(null)
  
  // ВЫЧИСЛЕНИЕ ВИЗУАЛЬНОГО СТАТУСА
  const visualStatus = useMemo((): VisualStatus => {
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
  }, [unit])

  // ЦВЕТА ПО СТАТУСАМ
  const color = useMemo(() => {
    switch (visualStatus) {
      case 'IN_STORE_AVAILABLE': 
        return unit.pulse ? '#ff4444' : '#666666' // Красный если пульсирует, иначе серый
      case 'IN_REQUEST': return '#0099ff' // Синий
      case 'IN_DELIVERY': return '#00aaff' // Голубой
      case 'SOLD': return '#333333' // Темно-серый
      case 'CREDIT': return '#553333' // Коричневатый
      default: return '#666666'
    }
  }, [visualStatus, unit.pulse])

  // ПУЛЬСАЦИЯ
  useFrame(({ clock }) => {
    if (meshRef.current && unit.pulse) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1
      meshRef.current.scale.setScalar(scale)
    }
  })

  if (visualStatus === 'HIDDEN') return null

  return (
    <mesh
      ref={meshRef}
      position={[unit.position.x, unit.position.y, unit.position.z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick(unit)
      }}
    >
      <boxGeometry args={[unit.size.x, unit.size.y, unit.size.z]} />
      <meshStandardMaterial 
        color={color} 
        transparent={visualStatus === 'SOLD' || visualStatus === 'CREDIT'}
        opacity={visualStatus === 'SOLD' || visualStatus === 'CREDIT' ? 0.6 : 1}
      />
      
      {/* Подсветка выделения */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[unit.size.x + 0.1, unit.size.y + 0.1, unit.size.z + 0.1]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Название бренда над кубом */}
      <Text
        position={[0, unit.size.y / 2 + 0.2, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {unit.brandName}
      </Text>
    </mesh>
  )
}