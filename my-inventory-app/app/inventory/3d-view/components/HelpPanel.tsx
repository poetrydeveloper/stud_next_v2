// /app/inventory/3d-view/components/HelpPanel.tsx

interface HelpPanelProps {
  showHelp: boolean
  setShowHelp: (show: boolean) => void
}

export const HelpPanel = ({ showHelp, setShowHelp }: HelpPanelProps) => {
  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: '1px solid #333',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ?
      </button>
    )
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '400px',
      fontSize: '14px',
      lineHeight: '1.5',
      border: '1px solid #333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, color: '#0099ff' }}>Управление</h3>
        <button 
          onClick={() => setShowHelp(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <strong>Движение:</strong>
          <div>W/S - Вперед/Назад</div>
          <div>A/D - Влево/Вправо</div>
          <div>Q/E - Вверх/Вниз</div>
          <div>Shift - Ускорение</div>
        </div>
        <div>
          <strong>Камера:</strong>
          <div>Мышь - Вращение</div>
          <div>Колесо - Zoom</div>
          <div>1 - Общий вид</div>
          <div>R - Сброс камеры</div>
        </div>
      </div>
      
      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
        <strong>Выделение:</strong>
        <div>Клик - Выбрать объект</div>
        <div>F - Фокус на выделенный</div>
        <div>Правый клик - Контекстное меню</div>
      </div>
    </div>
  )
}