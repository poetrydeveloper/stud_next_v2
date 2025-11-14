// app/super-add/components/ProductModal/hooks/useBrandsSuppliers.ts
import { useState, useEffect } from 'react';

interface Brand {
  id: number;
  name: string;
  slug: string;
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
      console.log('🔄 useBrandsSuppliers: Загрузка брендов и поставщиков');
      const [brandsRes, suppliersRes] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/suppliers')
      ]);

      const brandsData = await brandsRes.json();
      const suppliersData = await suppliersRes.json();

      console.log('📦 useBrandsSuppliers: Данные получены', {
        brands: brandsData.ok ? brandsData.data.length : 0,
        suppliers: suppliersData.ok ? suppliersData.data.length : 0
      });

      if (brandsData.ok) setBrands(brandsData.data);
      if (suppliersData.ok) setSuppliers(suppliersData.data);
    } catch (error) {
      console.error('❌ useBrandsSuppliers: Ошибка загрузки:', error);
    }
  };

  return { brands, suppliers, reload: loadBrandsAndSuppliers };
}