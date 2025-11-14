// app/cash-days/components/NoCashDayState.tsx
interface NoCashDayStateProps {
  isOpening: boolean;
  onOpen: () => void;
}

export default function NoCashDayState({ isOpening, onOpen }: NoCashDayStateProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="text-center py-8">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Кассовый день не открыт
        </h3>
        <p className="text-gray-600 mb-6">
          Откройте кассовый день чтобы начать работу с продажами
        </p>
        <button
          onClick={onOpen}
          disabled={isOpening}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2 mx-auto"
        >
          {isOpening ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>📅</span>
              <span>Открыть кассовый день</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}