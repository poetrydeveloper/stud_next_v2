interface WizardFooterProps {
  mode: 'category' | 'spine' | 'product';
  step: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  validateStep: () => boolean;
}

export default function WizardFooter({
  mode,
  step,
  loading,
  onBack,
  onNext
}: WizardFooterProps) {
  return (
    <div className="bg-gray-50 px-6 py-4 border-t">
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          disabled={loading}
        >
          {step === 1 ? 'Отмена' : 'Назад'}
        </button>
        
        <button
          onClick={onNext}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Создание...
            </>
          ) : (
            mode === 'product' && step === 1 ? 'Далее' : 'Создать'
          )}
        </button>
      </div>
    </div>
  );
}