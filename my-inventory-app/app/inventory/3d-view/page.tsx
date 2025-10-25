// /app/inventory/3d-view/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { Universe } from './components/Universe'
import { WelcomeModal } from './components/WelcomeModal'

export default function Inventory3DPage() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [hasVisited, setHasVisited] = useState(true)

  useEffect(() => {
    // Проверяем, первый ли это визит
    const visited = localStorage.getItem('3d-inventory-visited')
    if (!visited) {
      setShowWelcome(true)
      setHasVisited(false)
    }
  }, [])

  const handleWelcomeClose = () => {
    setShowWelcome(false)
    if (!hasVisited) {
      localStorage.setItem('3d-inventory-visited', 'true')
      setHasVisited(true)
    }
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* Header Stats */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #0099ff, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            3D Inventory System
          </h1>
          <div style={{ 
            fontSize: '12px', 
            background: 'rgba(0, 153, 255, 0.2)',
            padding: '4px 8px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 153, 255, 0.3)'
          }}>
            BETA
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '30px',
          fontSize: '14px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Товаров в наличии</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ff88' }}>
              {/* Здесь можно добавить реальные данные */}
              1,247
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>В поставке</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0099ff' }}>
              89
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Продано сегодня</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffaa00' }}>
              23
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        width: '100%',
        height: '100vh',
        paddingTop: '60px' // Отступ для header
      }}>
        <Universe />
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 20px',
        color: 'white',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        <div>
          Система 3D визуализации инвентаря • v1.0.0
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span>FPS: 60</span>
          <span>Объектов: 1,335</span>
          <span>Память: 256MB</span>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeModal onClose={handleWelcomeClose} />
      )}
    </div>
  )
}