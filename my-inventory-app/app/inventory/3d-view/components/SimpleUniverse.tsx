// /app/inventory/3d-view/components/SimpleUniverse.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Box } from '@react-three/drei'

export const SimpleUniverse = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#0a0a0a']} />
        
        {/* Освещение */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        
        {/* Управление камерой */}
        <OrbitControls />
        
        {/* Тестовые объекты */}
        <Box position={[-3, 0, 0]} args={[2, 2, 2]}>
          <meshStandardMaterial color="#ff4444" transparent opacity={0.6} />
        </Box>
        
        <Box position={[0, 0, 0]} args={[1.5, 1.5, 1.5]}>
          <meshStandardMaterial color="#44ff44" transparent opacity={0.6} />
        </Box>
        
        <Box position={[3, 0, 0]} args={[1, 1, 1]}>
          <meshStandardMaterial color="#4444ff" transparent opacity={0.6} />
        </Box>
        
        {/* Текст */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          3D Inventory - Работает!
        </Text>
      </Canvas>
    </div>
  )
}