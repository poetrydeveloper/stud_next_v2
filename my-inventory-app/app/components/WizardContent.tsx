import CategoryStep from "./steps/CategoryStep";
import SpineStep from "./steps/SpineStep";
import ProductStep from "./steps/ProductStep";
import ProductUnitStep from "./steps/ProductUnitStep";

interface WizardContentProps {
  mode: 'category' | 'spine' | 'product';
  step: number;
  formData: any;
  selectedNode: any;
  brands: any[];
  suppliers: any[];
  error: string;
  handleInputChange: (field: string, value: string | boolean) => void;
}

export default function WizardContent({
  mode,
  step,
  formData,
  selectedNode,
  brands,
  suppliers,
  error,
  handleInputChange
}: WizardContentProps) {
  return (
    <div className="p-6 overflow-y-auto max-h-[60vh]">
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Шаг 1 - Основная информация */}
      {(step === 1 || mode !== 'product') && (
        <div className="space-y-4">
          {mode === 'category' && (
            <CategoryStep
              formData={formData}
              selectedNode={selectedNode}
              handleInputChange={handleInputChange}
            />
          )}

          {mode === 'spine' && (
            <SpineStep
              formData={formData}
              selectedNode={selectedNode}
              handleInputChange={handleInputChange}
            />
          )}

          {mode === 'product' && (
            <ProductStep
              formData={formData}
              selectedNode={selectedNode}
              brands={brands}
              handleInputChange={handleInputChange}
            />
          )}
        </div>
      )}

      {/* Шаг 2 - Настройки Unit и заявки (только для товара) */}
      {mode === 'product' && step === 2 && (
        <ProductUnitStep
          formData={formData}
          selectedNode={selectedNode}
          suppliers={suppliers}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
}