// /app/inventory/3d-view/components/SpineCube.tsx

import { useRef } from 'react'
import { Mesh } from 'three'
import { Text } from '@react-three/drei'
import { SpineCube as SpineCubeType } from '../types/inventory3d'

interface SpineCubeProps {
  spine: SpineCubeType
}

export const SpineCube = ({ spine }: SpineCubeProps) => {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh
      ref={meshRef}
      position={[spine.position.x, spine.position.y, spine.position.z]}
    >
      <boxGeometry args={[spine.size.x, spine.size.y, spine.size.z]} />
      <meshStandardMaterial 
        color={spine.color} 
        transparent 
        opacity={0.5}
      />
      
      {/* Название spine */}
      <Text
        position={[0, spine.size.y / 2 + 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {spine.name}
      </Text>
    </mesh>
  )
}