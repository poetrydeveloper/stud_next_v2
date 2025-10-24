// app/product-units/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductUnit, Product } from "@/types/product-unit";

export default function EditProductUnitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [unit, setUnit] = useState<ProductUnit | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Параллельно загружаем unit и список продуктов
      const [unitResponse, productsResponse] = await Promise.all([
        fetch(`/api/product-units/${id}`),
        fetch("/api/products")
      ]);

      if (!unitResponse.ok) {
        throw new Error("Failed to fetch unit");
      }

      const unitData = await unitResponse.json();
      setUnit(unitData);

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.data || []);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit) return;
    
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/product-units/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serialNumber: unit.serialNumber,
          salePrice: unit.salePrice,
          purchasePrice: unit.purchasePrice,
          statusProduct: unit.statusProduct,
          statusCard: unit.statusCard,
          buyerName: unit.buyerName,
          buyerPhone: unit.buyerPhone,
          notes: unit.notes,
          // Можно добавить productId если нужно сменить продукт
        }),
      });

      if (response.ok) {
        router.push(`/product-units/${id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update unit");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating unit");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProductUnit, value: any) => {
    if (unit) {
      setUnit({ ...unit, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit not found</h1>
          <p className="text-gray-600 mb-6">The product unit you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/product-units")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Units
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit Product Unit
        </h1>
        <p className="text-gray-600">
          Editing unit: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{unit.serialNumber}</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={unit.serialNumber}
                  onChange={(e) => handleChange("serialNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    value={unit.purchasePrice || ""}
                    onChange={(e) => handleChange("purchasePrice", e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    value={unit.salePrice || ""}
                    onChange={(e) => handleChange("salePrice", e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Status
                  </label>
                  <select
                    value={unit.statusProduct || ""}
                    onChange={(e) => handleChange("statusProduct", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="IN_STORE">In Store</option>
                    <option value="SOLD">Sold</option>
                    <option value="CREDIT">Credit</option>
                    <option value="LOST">Lost</option>
                    <option value="RETURNED">Returned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Status
                  </label>
                  <select
                    value={unit.statusCard || ""}
                    onChange={(e) => handleChange("statusCard", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="CANDIDATE">Candidate</option>
                    <option value="CLEAR">Clear</option>
                    <option value="SPROUTED">Sprouted</option>
                    <option value="IN_REQUEST">In Request</option>
                    <option value="IN_DELIVERY">In Delivery</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Product Information</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Product Name:</span>
                <p className="font-medium">{unit.productName || unit.product?.name || "—"}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Product Code:</span>
                <p className="font-mono bg-gray-50 px-2 py-1 rounded text-sm">{unit.product?.code || "—"}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Category:</span>
                <p className="font-medium">{unit.product?.category?.name || "—"}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Spine:</span>
                <p className="font-medium">{unit.product?.spine?.name || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Information & Notes */}
        <div className="space-y-6">
          {/* Sales Information */}
          {(unit.statusProduct === "SOLD" || unit.statusProduct === "CREDIT") && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Sales Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    value={unit.buyerName || ""}
                    onChange={(e) => handleChange("buyerName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buyer Phone
                  </label>
                  <input
                    type="text"
                    value={unit.buyerPhone || ""}
                    onChange={(e) => handleChange("buyerPhone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {unit.isCredit && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isCredit"
                      checked={unit.isCredit}
                      onChange={(e) => handleChange("isCredit", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="isCredit" className="text-sm text-gray-700">
                      Sold on Credit
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Notes</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={unit.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional notes about this unit..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => router.push(`/product-units/${id}`)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}