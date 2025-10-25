// /app/inventory/3d-view/components/LoadingOverlay.tsx

export const LoadingOverlay = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 1000,
      fontSize: '18px'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid #0099ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <p>Загрузка 3D инвентаря...</p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}