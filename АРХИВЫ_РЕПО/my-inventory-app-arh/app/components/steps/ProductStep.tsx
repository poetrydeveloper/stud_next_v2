interface ProductStepProps {
  formData: any;
  selectedNode: any;
  brands: any[];
  handleInputChange: (field: string, value: string | boolean) => void;
}

export default function ProductStep({ formData, selectedNode, brands, handleInputChange }: ProductStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-2">Название товара *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.productName}
          onChange={(e) => handleInputChange('productName', e.target.value)}
          placeholder="Введите название товара"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Код товара *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.productCode}
          onChange={(e) => handleInputChange('productCode', e.target.value)}
          placeholder="Введите уникальный код"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Описание</label>
        <textarea
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={formData.productDescription}
          onChange={(e) => handleInputChange('productDescription', e.target.value)}
          placeholder="Описание товара (необязательно)"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Бренд</label>
        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.productBrandId}
          onChange={(e) => handleInputChange('productBrandId', e.target.value)}
        >
          <option value="">-- выберите бренд --</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Информация о расположении */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <div className="text-sm text-blue-800">
          <div className="font-medium">Расположение:</div>
          {selectedNode?.type === 'category' && (
            <div>📁 Категория: <strong>{selectedNode.name}</strong></div>
          )}
          {selectedNode?.type === 'spine' && (
            <div>🔷 Spine: <strong>{selectedNode.name}</strong></div>
          )}
          {formData.spineName && selectedNode?.type === 'category' && (
            <div>🆕 Будет создан Spine: <strong>{formData.spineName}</strong></div>
          )}
        </div>
      </div>
    </div>
  );
}