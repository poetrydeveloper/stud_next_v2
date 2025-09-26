// //app/components/CandidateUnitCard.tsx

// "use client";

// export default function CandidateUnitCard({ unit }) {
//   return (
//     <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200 flex flex-col justify-between">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-800 mb-2">
//           {unit.productName || unit.product?.name || "Без названия"}
//         </h3>

//         <p className="text-sm text-gray-500 mb-1">
//           Серийный №: <span className="font-medium">{unit.serialNumber}</span>
//         </p>

//         <p className="text-sm text-gray-500 mb-1">
//           Количество в кандидате: <span className="font-medium">{unit.quantityInCandidate}</span>
//         </p>

//         <p className="text-sm text-gray-500 mb-1">
//           Добавлено:{" "}
//           <span className="font-medium">
//             {unit.createdAtCandidate ? new Date(unit.createdAtCandidate).toLocaleString() : "-"}
//           </span>
//         </p>

//         <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
//           {unit.statusCard || "CANDIDATE"}
//         </span>
//       </div>
//     </div>
//   );
// }

// app/components/CandidateUnitCard.tsx
"use client";

interface CandidateUnitCardProps {
  unit: {
    id: number;
    serialNumber: string;
    productName?: string;
    product?: {
      name: string;
      code: string;
      images?: Array<{
        id: number;
        path: string;
        isMain: boolean;
      }>;
      spine?: {
        name: string;
      };
      category?: {
        name: string;
      };
    };
    quantityInCandidate?: number;
    createdAtCandidate?: string;
    statusCard?: string;
    spine?: {
      name: string;
    };
  };
}

export default function CandidateUnitCard({ unit }: CandidateUnitCardProps) {
  // Получаем основное изображение
  const mainImage = unit.product?.images?.find(img => img.isMain) || unit.product?.images?.[0];
  
  // Форматируем дату
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Статус баджи с цветами
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CANDIDATE: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Кандидат' },
      CLEAR: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Чистый' },
      SPROUTED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Проросший' },
      IN_REQUEST: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'В заявке' },
      IN_DELIVERY: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'В доставке' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.CANDIDATE;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Изображение товара */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage.path}
            alt={unit.productName || unit.product?.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Нет изображения</span>
            </div>
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-4">
        {/* Заголовок и статус */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {unit.productName || unit.product?.name || "Без названия"}
          </h3>
          {getStatusBadge(unit.statusCard || "CANDIDATE")}
        </div>

        {/* Серийный номер */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Серийный номер
          </div>
          <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
            {unit.serialNumber}
          </p>
        </div>

        {/* Информация о товаре */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Spine</div>
            <div className="text-sm font-medium text-gray-800">
              {unit.product?.spine?.name || unit.spine?.name || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Категория</div>
            <div className="text-sm font-medium text-gray-800">
              {unit.product?.category?.name || "—"}
            </div>
          </div>
        </div>

        {/* Кандидатская информация */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-yellow-800">Информация о кандидате</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-yellow-600">Количество</div>
              <div className="text-sm font-semibold text-yellow-900">
                {unit.quantityInCandidate || 0} шт.
              </div>
            </div>
            <div>
              <div className="text-xs text-yellow-600">Добавлено</div>
              <div className="text-sm font-semibold text-yellow-900">
                {unit.createdAtCandidate ? formatDate(unit.createdAtCandidate) : "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Код товара (если есть) */}
        {unit.product?.code && (
          <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-2">
            <span>Код товара:</span>
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {unit.product.code}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
