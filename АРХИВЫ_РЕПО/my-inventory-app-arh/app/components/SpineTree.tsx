//app/components/SpineTree.tsx

"use client";

import { useEffect, useState } from "react";

interface Spine {
  id: number;
  name: string;
}

export default function SpineTree() {
  const [tree, setTree] = useState<Record<string, Spine[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/spines/tree")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setTree(data.data);
        else setError("Ошибка загрузки спайнов");
      })
      .catch(() => setError("Ошибка загрузки спайнов"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      {Object.keys(tree).map((category) => (
        <div key={category} className="mb-3">
          <p className="font-semibold">{category}</p>
          <ul className="ml-4 list-disc">
            {tree[category].map((spine) => (
              <li key={spine.id}>{spine.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
