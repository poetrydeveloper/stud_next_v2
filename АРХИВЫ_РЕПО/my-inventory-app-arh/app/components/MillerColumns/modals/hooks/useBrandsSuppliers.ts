// components/MillerColumns/modals/hooks/useBrandsSuppliers.ts
import { useState, useEffect } from 'react';

interface Brand {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export function useBrandsSuppliers() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    loadBrandsAndSuppliers();
  }, []);

  const loadBrandsAndSuppliers = async () => {
    try {
      const [brandsRes, suppliersRes] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/suppliers')
      ]);

      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData.data || brandsData);
      }
      
      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData.data || suppliersData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  return { brands, suppliers, reload: loadBrandsAndSuppliers };
}