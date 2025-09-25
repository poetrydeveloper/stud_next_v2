import prisma from "@/app/lib/prisma";
import UnitsGrid from "./UnitsGrid";
import CandidateUnitsGrid from "@/app/components/CandidateUnitsGrid";

export default async function ProductUnitsPage() {
  const units = await prisma.productUnit.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true },
  });

  // Фильтруем кандидатов
  const candidateUnits = units.filter((u) => u.statusCard === "CANDIDATE");
  const normalUnits = units.filter((u) => u.statusCard !== "CANDIDATE");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Единицы товара</h1>

      <UnitsGrid units={normalUnits} />

      <CandidateUnitsGrid units={candidateUnits} />
    </div>
  );
}
