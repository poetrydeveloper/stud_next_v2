// components/MillerColumns/modals/SpineModal.tsx
'use client';

import { useState } from 'react';
import styles from '../MillerColumns.module.css';

type SpineModalProps = {
  onClose: () => void;
  onSubmit: (name: string, parentPath: string) => void;
  parentPath: string;
};

export function SpineModal({ onClose, onSubmit, parentPath }: SpineModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Введите название spine');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(name.trim(), parentPath);
    } catch (error) {
      console.error('Ошибка создания spine:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Создать Spine</h3>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Название spine:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {parentPath && (
            <div className={styles.formInfo}>
              <small>Родительский путь: {parentPath}</small>
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Отмена
            </button>
            
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}