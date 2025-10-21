interface ProductUnitStepProps {
  formData: any;
  selectedNode: any;
  suppliers: any[];
  handleInputChange: (field: string, value: string | boolean) => void;
}

export default function ProductUnitStep({ formData, selectedNode, suppliers, handleInputChange }: ProductUnitStepProps) {
  return (
    <div className="space-y-6">
      
      {/* Создание Unit */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.createUnit}
            onChange={(e) => handleInputChange('createUnit', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium">Создать Product Unit</span>
        </label>
        
        {formData.createUnit && (
          <div className="mt-4 space-y-4 ml-6">
            
            {/* Поставщик */}
            <div>
              <label className="block font-medium mb-2 text-sm">Поставщик</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.supplierId}
                onChange={(e) => handleInputChange('supplierId', e.target.value)}
              >
                <option value="">-- выберите поставщика --</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Цена за единицу */}
            <div>
              <label className="block font-medium mb-2 text-sm">Цена за единицу</label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.requestPricePerUnit}
                onChange={(e) => handleInputChange('requestPricePerUnit', e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Сделать кандидатом */}
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.makeCandidate}
                onChange={(e) => handleInputChange('makeCandidate', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-sm">Сделать кандидатом и создать заявку</span>
            </label>

            {/* Настройки заявки */}
            {formData.makeCandidate && (
              <div className="mt-4 space-y-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div className="font-medium text-sm text-yellow-800">Настройки заявки</div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1 text-sm">Количество *</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={formData.requestQuantity}
                      onChange={(e) => handleInputChange('requestQuantity', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium mb-1 text-sm">Цена за единицу *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={formData.requestPrice}
                      onChange={(e) => handleInputChange('requestPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                {formData.requestQuantity && formData.requestPrice && (
                  <div className="text-sm text-yellow-700">
                    Итого: <strong>
                      {parseInt(formData.requestQuantity) * parseFloat(formData.requestPrice || '0')} руб.
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Сводка */}
      <div className="bg-green-50 border border-green-200 rounded p-4">
        <div className="font-medium text-green-800 mb-2">Будет создано:</div>
        <div className="text-sm text-green-700 space-y-1">
          <div>• Товар: <strong>{formData.productName}</strong></div>
          {formData.createUnit && <div>• Product Unit</div>}
          {formData.makeCandidate && <div>• Заявка на {formData.requestQuantity} шт.</div>}
          {formData.spineName && selectedNode?.type === 'category' && (
            <div>• Spine: <strong>{formData.spineName}</strong></div>
          )}
        </div>
      </div>
    </div>
  );
}