// components/MillerColumns/panels/QuickRequestPanel.tsx
'use client';

import { useState } from 'react';
import styles from '../MillerColumns.module.css';

type QuickRequestPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: {
    id: number;
    name: string;
    code: string;
  };
};

export function QuickRequestPanel({ isOpen, onClose, selectedProduct }: QuickRequestPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      alert('Выберите продукт для создания заявки');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/product-units/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: selectedProduct.code,
          quantity,
          price: price ? parseFloat(price) : undefined,
          notes: notes.trim() || undefined
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Заявка успешно создана!');
        onClose();
        setQuantity(1);
        setPrice('');
        setNotes('');
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      alert('Ошибка создания заявки');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.panelOverlay}>
      <div className={styles.panelContent}>
        <h3 className={styles.panelTitle}>Быстрая заявка</h3>
        
        {selectedProduct && (
          <div className={styles.selectedProduct}>
            <strong>Продукт:</strong> {selectedProduct.name} ({selectedProduct.code})
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Количество *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Цена за единицу (необязательно)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Примечания</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительная информация"
              rows={3}
            />
          </div>

          <div className={styles.panelActions}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={styles.cancelBtn}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || !selectedProduct}
              className={styles.submitBtn}
            >
              {loading ? 'Создание...' : 'Создать заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}