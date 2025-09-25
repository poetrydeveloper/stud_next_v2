//app/components/CandidateUnitsGrid.tsx

"use client";

import CandidateUnitCard from "./CandidateUnitCard";

export default function CandidateUnitsGrid({ units }) {
  if (!units || units.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Кандидаты</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {units.map((unit) => (
          <CandidateUnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}
