// components/MillerColumns/modals/ProductUnitsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from '../MillerColumns.module.css';

type ProductUnit = {
  id: number;
  serialNumber: string;
  statusCard: string;
  statusProduct: string;
  salePrice?: number;
  supplier?: { name: string };
  customer?: { name: string };
};

type ProductUnitsModalProps = {
  onClose: () => void;
  product: {
    id: number;
    name: string;
    code: string;
  };
};

export function ProductUnitsModal({ onClose, product }: ProductUnitsModalProps) {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductUnits = async () => {
      try {
        const response = await fetch(`/api/product-units/by-product-code?productCode=${product.code}`);
        if (response.ok) {
          const data = await response.json();
          setUnits(data.units || []);
        }
      } catch (error) {
        console.error('Ошибка загрузки product units:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductUnits();
  }, [product.code]);

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'IN_STORE': 'bg-green-100 text-green-800',
      'SOLD': 'bg-blue-100 text-blue-800',
      'CREDIT': 'bg-yellow-100 text-yellow-800',
      'CLEAR': 'bg-gray-100 text-gray-800',
      'ARRIVED': 'bg-purple-100 text-purple-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
        <h3 className={styles.modalTitle}>
          Product Units: {product.name} ({product.code})
        </h3>

        {loading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : units.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Нет товарных единиц для этого продукта
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Серийный номер
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Цена
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Поставщик
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {unit.serialNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(unit.statusProduct)}`}>
                        {unit.statusProduct}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {unit.salePrice ? `${unit.salePrice} ₽` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {unit.supplier?.name || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}