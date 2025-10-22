interface WizardHeaderProps {
  mode: 'category' | 'spine' | 'product';
  step: number;
  onClose: () => void;
}

export default function WizardHeader({ mode, step, onClose }: WizardHeaderProps) {
  const getTitle = () => {
    switch (mode) {
      case 'category': return 'Создание категории';
      case 'spine': return 'Создание Spine';
      case 'product': return 'Создание товара';
      default: return 'Создание';
    }
  };

  const getStepTitle = () => {
    if (mode === 'product') {
      switch (step) {
        case 1: return 'Основная информация';
        case 2: return 'Настройки Unit и заявки';
        default: return 'Завершение';
      }
    }
    return 'Основная информация';
  };

  return (
    <div className="bg-gray-50 px-6 py-4 border-b">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-sm text-gray-600 mt-1">{getStepTitle()}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}