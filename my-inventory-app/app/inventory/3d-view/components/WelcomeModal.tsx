// /app/inventory/3d-view/components/WelcomeModal.tsx

interface WelcomeModalProps {
  onClose: () => void
}

export const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '500px',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0',
          background: 'linear-gradient(45deg, #0099ff, #00ff88)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Добро пожаловать в 3D инвентарь!
        </h2>
        
        <div style={{ lineHeight: '1.6', marginBottom: '25px' }}>
          <p>Это инновационная система визуализации вашего инвентаря в трехмерном пространстве.</p>
          
          <div style={{ margin: '20px 0' }}>
            <h4 style={{ color: '#0099ff', marginBottom: '10px' }}>Основные возможности:</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li>3D навигация по категориям и товарам</li>
              <li>Визуализация поставок в реальном времени</li>
              <li>Интерактивное управление инвентарем</li>
              <li>Мгновенный доступ к информации о товарах</li>
            </ul>
          </div>
          
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Используйте подсказки в интерфейсе для навигации. Вы всегда можете открыть панель помощи кнопкой "?" в левом нижнем углу.
          </p>
        </div>
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(45deg, #0099ff, #00aaff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Начать использование
        </button>
      </div>
    </div>
  )
}