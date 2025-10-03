// app/components/CandidateUnitsGrid.tsx
"use client";

import { CandidateUnit } from "@/types/product-unit";
import CandidateUnitCard from "./CandidateUnitCard";

interface CandidateUnitsGridProps {
  units: CandidateUnit[];
}

export default function CandidateUnitsGrid({ units }: CandidateUnitsGridProps) {
  if (!units || units.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Кандидаты</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <CandidateUnitCard key={unit.id} unit={unit} />
        ))}
      </div>
    </div>
  );
}