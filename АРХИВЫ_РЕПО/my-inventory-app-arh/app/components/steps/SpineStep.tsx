interface SpineStepProps {
  formData: any;
  selectedNode: any;
  handleInputChange: (field: string, value: string | boolean) => void;
}

export default function SpineStep({ formData, selectedNode, handleInputChange }: SpineStepProps) {
  return (
    <div>
      <label className="block font-medium mb-2">Название Spine *</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.spineName}
        onChange={(e) => handleInputChange('spineName', e.target.value)}
        placeholder="Введите название Spine"
      />
      {selectedNode && (
        <p className="text-sm text-gray-600 mt-2">
          Будет создан в категории: <strong>{selectedNode.name}</strong>
        </p>
      )}
    </div>
  );
}