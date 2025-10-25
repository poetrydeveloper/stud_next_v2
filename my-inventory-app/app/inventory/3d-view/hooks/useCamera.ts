// /app/inventory/3d-view/hooks/useCamera.ts

import { useRef, useCallback } from 'react'
import { Vector3 } from 'three'

interface CameraState {
  position: Vector3
  target: Vector3
  isMoving: boolean
}

interface MoveState {
  forward: boolean
  backward: boolean 
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  fast: boolean
}

export const useCamera = () => {
  const moveState = useRef<MoveState>({
    forward: false,
    backward: false, 
    left: false,
    right: false,
    up: false,
    down: false,
    fast: false
  })

  const cameraState = useRef<CameraState>({
    position: new Vector3(0, 10, 20),
    target: new Vector3(0, 0, 0),
    isMoving: false
  })

  // Фокус на объект
  const focusOnObject = useCallback((position: Vector3, size: Vector3, camera?: any) => {
    const boundingSphereRadius = Math.max(size.x, size.y, size.z) * 0.8
    const distance = boundingSphereRadius * 3
    
    const direction = new Vector3(0, 0.5, 1).normalize()
    const newPosition = position.clone().add(direction.multiplyScalar(distance))
    
    cameraState.current.position.copy(newPosition)
    cameraState.current.target.copy(position)
    
    if (camera) {
      camera.position.copy(newPosition)
      camera.lookAt(position)
    }

    return {
      newPosition,
      target: position
    }
  }, [])

  // Движение камеры (вызывается из useFrame)
  const updateCamera = useCallback((camera: any, delta: number) => {
    if (!cameraState.current.isMoving) return

    const speed = moveState.current.fast ? 25 * delta : 10 * delta
    const moveVector = new Vector3()
    
    if (moveState.current.forward) moveVector.z -= speed
    if (moveState.current.backward) moveVector.z += speed
    if (moveState.current.left) moveVector.x -= speed
    if (moveState.current.right) moveVector.x += speed
    if (moveState.current.up) moveVector.y += speed
    if (moveState.current.down) moveVector.y -= speed
    
    camera.position.add(moveVector)
    cameraState.current.position.copy(camera.position)
    cameraState.current.target.add(moveVector)
    camera.lookAt(cameraState.current.target)
  }, [])

  // Управление с клавиатуры
  const setupKeyboardControls = useCallback((camera: any, gl: any) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w': moveState.current.forward = true; break
        case 's': moveState.current.backward = true; break
        case 'a': moveState.current.left = true; break
        case 'd': moveState.current.right = true; break
        case 'q': moveState.current.up = true; break
        case 'e': moveState.current.down = true; break
        case 'shift': moveState.current.fast = true; break
        
        // Горячие клавиши
        case '1': 
          cameraState.current.position.set(0, 15, 25)
          cameraState.current.target.set(0, 0, 0)
          camera.position.copy(cameraState.current.position)
          camera.lookAt(cameraState.current.target)
          break
          
        case '2': 
          focusOnObject(new Vector3(0, 0, 0), new Vector3(10, 10, 10), camera)
          break
          
        case 'r': 
          cameraState.current.position.set(0, 10, 20)
          cameraState.current.target.set(0, 0, 0)
          camera.position.copy(cameraState.current.position)
          camera.lookAt(cameraState.current.target)
          break
          
        case 'f': 
          // Focus on selected object (будет реализовано позже)
          break
      }
      
      cameraState.current.isMoving = true
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w': moveState.current.forward = false; break
        case 's': moveState.current.backward = false; break
        case 'a': moveState.current.left = false; break
        case 'd': moveState.current.right = false; break
        case 'q': moveState.current.up = false; break
        case 'e': moveState.current.down = false; break
        case 'shift': moveState.current.fast = false; break
      }
      
      // Проверяем, движется ли еще камера
      const isMoving = Object.values(moveState.current).some(val => val === true)
      cameraState.current.isMoving = isMoving
    }

    const handleBlur = () => {
      // Сбрасываем состояние при потере фокуса
      Object.keys(moveState.current).forEach(key => {
        moveState.current[key as keyof MoveState] = false
      })
      cameraState.current.isMoving = false
    }

    // Устанавливаем обработчики
    gl.domElement.addEventListener('keydown', handleKeyDown)
    gl.domElement.addEventListener('keyup', handleKeyUp)
    gl.domElement.addEventListener('blur', handleBlur)
    gl.domElement.tabIndex = 1
    gl.domElement.focus()

    return () => {
      gl.domElement.removeEventListener('keydown', handleKeyDown)
      gl.domElement.removeEventListener('keyup', handleKeyUp)
      gl.domElement.removeEventListener('blur', handleBlur)
    }
  }, [focusOnObject])

  // Получить текущее состояние камеры
  const getCameraState = useCallback(() => ({
    position: cameraState.current.position.clone(),
    target: cameraState.current.target.clone(),
    isMoving: cameraState.current.isMoving
  }), [])

  // Установить позицию камеры
  const setCameraPosition = useCallback((position: Vector3, target?: Vector3, camera?: any) => {
    cameraState.current.position.copy(position)
    
    if (camera) {
      camera.position.copy(position)
      
      if (target) {
        cameraState.current.target.copy(target)
        camera.lookAt(target)
      }
    }
  }, [])

  // Инициализация камеры
  const initCamera = useCallback((camera: any) => {
    camera.position.copy(cameraState.current.position)
    camera.lookAt(cameraState.current.target)
  }, [])

  return {
    initCamera,
    setupKeyboardControls,
    updateCamera,
    focusOnObject,
    getCameraState,
    setCameraPosition,
    isMoving: cameraState.current.isMoving
  }
}