// /app/inventory/3d-view/components/Universe.tsx

'use client'

import { useState, useRef, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import { CameraController } from './CameraController'
import { Scene3D } from './Scene3D'
import { OverlayUI } from './OverlayUI'
import { ContextMenu } from './ContextMenu'
import { LoadingOverlay } from './LoadingOverlay'
import { HelpPanel } from './HelpPanel'
import { useInventory3D } from '../hooks/useInventory3D'
import { useCamera } from '../hooks/useCamera'
import { ProductUnitCube as ProductUnitType, CategoryCube as CategoryCubeType, SpineCube as SpineCubeType } from '../types/inventory3d'

export const Universe = () => {
  const [selectedUnit, setSelectedUnit] = useState<ProductUnitType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryCubeType | null>(null)
  const [selectedSpine, setSelectedSpine] = useState<SpineCubeType | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | null>(null)
  const [hoveredObject, setHoveredObject] = useState<{type: string; name: string} | null>(null)
  const [showHelp, setShowHelp] = useState(true)
  
  const canvasRef = useRef<HTMLDivElement>(null)
  const { focusOnObject } = useCamera()
  
  const { 
    categories, 
    spines, 
    productUnits, 
    requestLines, 
    salesPlane,
    loading,
    error
  } = useInventory3D()

  const handleUnitClick = useCallback((unit: ProductUnitType, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedUnit(unit)
    setSelectedCategory(null)
    setSelectedSpine(null)
    
    setContextMenuPosition({
      x: event.clientX,
      y: event.clientY
    })
  }, [])

  const handleCategoryClick = useCallback((category: CategoryCubeType, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedCategory(category)
    setSelectedUnit(null)
    setSelectedSpine(null)
    focusOnObject(
      new Vector3(category.position.x, category.position.y, category.position.z),
      new Vector3(category.size.x, category.size.y, category.size.z)
    )
  }, [focusOnObject])

  const handleSpineClick = useCallback((spine: SpineCubeType, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedSpine(spine)
    setSelectedUnit(null)
    setSelectedCategory(null)
    focusOnObject(
      new Vector3(spine.position.x, spine.position.y, spine.position.z),
      new Vector3(spine.size.x, spine.size.y, spine.size.z)
    )
  }, [focusOnObject])

  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    if (event.target === canvasRef.current) {
      setSelectedUnit(null)
      setSelectedCategory(null)
      setSelectedSpine(null)
      setContextMenuPosition(null)
    }
  }, [])

  const handleContextMenuAction = useCallback((action: string, unit: ProductUnitType) => {
    console.log(`Action: ${action} on unit:`, unit)
    
    switch (action) {
      case 'focus':
        focusOnObject(
          new Vector3(unit.position.x, unit.position.y, unit.position.z),
          new Vector3(unit.size.x, unit.size.y, unit.size.z)
        )
        break
      case 'order':
        console.log('Ordering unit:', unit.id)
        break
      case 'details':
        console.log('Showing details for unit:', unit.id)
        break
      case 'sales-history':
        console.log('Sales history for unit:', unit.id)
        break
      case 'change-price':
        console.log('Changing price for unit:', unit.id)
        break
      default:
        console.log('Unknown action:', action)
    }
    
    setContextMenuPosition(null)
  }, [focusOnObject])

  const handleObjectHover = useCallback((type: string, name: string, isHovered: boolean) => {
    if (isHovered) {
      setHoveredObject({ type, name })
    } else {
      setHoveredObject(null)
    }
  }, [])

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        backgroundColor: '#1a1a1a',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Ошибка загрузки 3D инвентаря</h2>
        <p style={{ color: '#ff4444' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0099ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Перезагрузить
        </button>
      </div>
    )
  }

  return (
    <div 
      ref={canvasRef}
      style={{ 
        width: '100%', 
        height: '100vh', 
        position: 'relative',
        cursor: hoveredObject ? 'pointer' : 'default'
      }}
      onClick={handleCanvasClick}
      tabIndex={0}
    >
      <OverlayUI 
        hoveredObject={hoveredObject}
        selectedUnit={selectedUnit}
        selectedCategory={selectedCategory}
        selectedSpine={selectedSpine}
      />

      <Suspense fallback={<LoadingOverlay />}>
        <Canvas
          camera={{ 
            position: [0, 15, 25], 
            fov: 50,
            near: 0.1,
            far: 1000 
          }}
          gl={{ 
            antialias: true,
            alpha: true 
          }}
          dpr={[1, 2]}
        >
          <Scene3D
            categories={categories}
            spines={spines}
            productUnits={productUnits}
            requestLines={requestLines}
            salesPlane={salesPlane}
            onUnitClick={handleUnitClick}
            onCategoryClick={handleCategoryClick}
            onSpineClick={handleSpineClick}
            onObjectHover={handleObjectHover}
            selectedUnit={selectedUnit}
            selectedCategory={selectedCategory}
            selectedSpine={selectedSpine}
          />
        </Canvas>
      </Suspense>

      {contextMenuPosition && selectedUnit && (
        <ContextMenu 
          position={contextMenuPosition}
          unit={selectedUnit}
          onAction={handleContextMenuAction}
          onClose={() => setContextMenuPosition(null)}
        />
      )}

      {loading && <LoadingOverlay />}

      <HelpPanel showHelp={showHelp} setShowHelp={setShowHelp} />
    </div>
  )
}