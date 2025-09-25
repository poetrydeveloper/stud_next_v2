//app/components/CandidateUnitCard.tsx

"use client";

export default function CandidateUnitCard({ unit }) {
  return (
    <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {unit.productName || unit.product?.name || "Без названия"}
        </h3>

        <p className="text-sm text-gray-500 mb-1">
          Серийный №: <span className="font-medium">{unit.serialNumber}</span>
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Количество в кандидате: <span className="font-medium">{unit.quantityInCandidate}</span>
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Добавлено:{" "}
          <span className="font-medium">
            {unit.createdAtCandidate ? new Date(unit.createdAtCandidate).toLocaleString() : "-"}
          </span>
        </p>

        <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
          {unit.statusCard || "CANDIDATE"}
        </span>
      </div>
    </div>
  );
}
