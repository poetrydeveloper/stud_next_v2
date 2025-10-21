import { useState, useEffect, useCallback } from "react";

interface Brand {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface FormData {
  categoryName: string;
  spineName: string;
  productName: string;
  productCode: string;
  productDescription: string;
  productBrandId: string;
  createUnit: boolean;
  makeCandidate: boolean;
  supplierId: string;
  requestPricePerUnit: string;
  requestQuantity: string;
  requestPrice: string;
}

export function useFormData(mode: string, selectedNode: any) {
  const [formData, setFormData] = useState<FormData>({
    categoryName: "",
    spineName: "",
    productName: "",
    productCode: "",
    productDescription: "",
    productBrandId: "",
    createUnit: true,
    makeCandidate: true,
    supplierId: "",
    requestPricePerUnit: "",
    requestQuantity: "1",
    requestPrice: ""
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const loadBrandsAndSuppliers = useCallback(async () => {
    try {
      // Загружаем бренды
      const brandsRes = await fetch('/api/brands');
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData.data || []);
      }

      // Загружаем поставщиков
      const suppliersRes = await fetch('/api/suppliers');
      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData.data || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }, []);

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Автозаполнение данных на основе выбранного узла
  useEffect(() => {
    if (selectedNode) {
      if (mode === 'spine' && selectedNode.type === 'category') {
        // Spine создается в выбранной категории - ничего не заполняем
      }
      if (mode === 'product') {
        if (selectedNode.type === 'category') {
          // Product создается в категории - spine будет создан автоматически
          setFormData(prev => ({
            ...prev,
            spineName: `${selectedNode.name} Spine`
          }));
        }
        if (selectedNode.type === 'spine') {
          // Product создается в существующем spine
          setFormData(prev => ({
            ...prev,
            spineName: selectedNode.name
          }));
        }
      }
    }
  }, [mode, selectedNode]);

  return {
    formData,
    brands,
    suppliers,
    handleInputChange,
    loadBrandsAndSuppliers
  };
}