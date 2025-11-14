"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BrandsPage() {
  const [brands, setBrands] = useState<{id:number,name:string,slug:string}[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then(res => res.json())
      .then(data => setBrands(data.data || []));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Бренды</h1>
      <Link href="/brands/new" className="mb-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Создать бренд
      </Link>

      <div className="bg-white rounded shadow p-4 border">
        {brands.length === 0 ? (
          <p className="text-gray-500">Бренды пока не созданы</p>
        ) : (
          <ul className="space-y-2">
            {brands.map(brand => (
              <li key={brand.id} className="flex justify-between border-b pb-1 last:border-none">
                <span>{brand.name}</span>
                <span className="text-xs text-gray-500">{brand.slug}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}