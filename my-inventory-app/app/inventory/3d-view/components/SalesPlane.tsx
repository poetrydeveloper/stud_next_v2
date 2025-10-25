// /app/inventory/3d-view/components/SalesPlane.tsx

import { useRef } from 'react'
import { Mesh } from 'three'
import { SalesPlane as SalesPlaneType } from '../types/inventory3d'

interface SalesPlaneProps {
  salesPlane: SalesPlaneType
}

export const SalesPlane = ({ salesPlane }: SalesPlaneProps) => {
  const meshRef = useRef<Mesh>(null)

  return (
    <mesh
      ref={meshRef}
      position={[salesPlane.position.x, salesPlane.position.y, salesPlane.position.z]}
    >
      <boxGeometry args={[salesPlane.size.x, salesPlane.size.y, salesPlane.size.z]} />
      <meshStandardMaterial 
        color="#444444" 
        transparent 
        opacity={0.2}
      />
    </mesh>
  )
}