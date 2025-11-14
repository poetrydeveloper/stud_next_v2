interface CategoryStepProps {
  formData: any;
  selectedNode: any;
  handleInputChange: (field: string, value: string | boolean) => void;
}

export default function CategoryStep({ formData, selectedNode, handleInputChange }: CategoryStepProps) {
  return (
    <div>
      <label className="block font-medium mb-2">Название категории *</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.categoryName}
        onChange={(e) => handleInputChange('categoryName', e.target.value)}
        placeholder="Введите название категории"
      />
      {selectedNode && (
        <p className="text-sm text-gray-600 mt-2">
          Родительская категория: <strong>{selectedNode.name}</strong>
        </p>
      )}
    </div>
  );
}