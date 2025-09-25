// app/product-units/candidates/page.tsx
"use client";

import { useEffect, useState } from "react";

interface ProductUnit {
  id: number;
  serialNumber: string;
  productName: string;
  quantityInCandidate: number;
  createdAtCandidate: string;
  requestPricePerUnit?: number;
}

export default function CandidatesPage() {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantityMap, setQuantityMap] = useState<Record<number, number>>({});
  const [priceMap, setPriceMap] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch("/api/product-units?status=CANDIDATE")
      .then((res) => res.json())
      .then((data) => setUnits(data.data || []));
  }, []);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantityMap({ ...quantityMap, [id]: value });
  };

  const handlePriceChange = (id: number, value: number) => {
    setPriceMap({ ...priceMap, [id]: value });
  };

  const handleCreateRequest = async (unit: ProductUnit) => {
    const quantity = quantityMap[unit.id] || 1;
    const price = priceMap[unit.id] || 0;

    setLoading(true);
    try {
      const res = await fetch("/api/product-units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentProductUnitId: unit.id,
          productId: unit.id, // можно передавать для проверки, сервер не создаёт новый продукт
          quantity,
          requestPricePerUnit: price,
          createRequest: true,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Создано ${data.data.length} единиц в заявку`);
        setUnits((prev) => prev.filter((u) => u.id !== unit.id)); // убираем родителя-кандидата
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Кандидаты на заявку</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white rounded shadow p-4 space-y-2">
            <h2 className="font-semibold">{unit.productName}</h2>
            <p>Серийный номер: {unit.serialNumber}</p>
            <p>Количество в кандидате: {unit.quantityInCandidate}</p>
            <p>Дата создания: {new Date(unit.createdAtCandidate).toLocaleString()}</p>
            <div className="flex space-x-2">
              <input
                type="number"
                min={1}
                value={quantityMap[unit.id] || 1}
                onChange={(e) => handleQuantityChange(unit.id, Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={priceMap[unit.id] || 0}
                onChange={(e) => handlePriceChange(unit.id, Number(e.target.value))}
                className="border rounded px-2 py-1 w-24"
                placeholder="Цена за шт."
              />
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                disabled={loading}
                onClick={() => handleCreateRequest(unit)}
              >
                В заявку
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
