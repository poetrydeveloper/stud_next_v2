// /app/inventory/3d-view/components/CameraController.tsx

import { useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useCamera } from '../hooks/useCamera'

export const CameraController = () => {
  const { camera, gl } = useThree()
  const { setupKeyboardControls, updateCamera, initCamera } = useCamera()

  // Инициализация камеры
  useEffect(() => {
    initCamera(camera)
  }, [camera, initCamera])

  // Настройка управления
  useEffect(() => {
    const cleanup = setupKeyboardControls(camera, gl)
    return cleanup
  }, [camera, gl, setupKeyboardControls])

  // Обновление камеры каждый кадр
  useFrame((_, delta) => {
    updateCamera(camera, delta)
  })

  return null
}