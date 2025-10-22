// app/super-add/components/ProductModal/hooks/useCreateEntities.ts
export function useCreateEntities(reloadLists: () => void) {
  const createBrand = async (brandName: string): Promise<number> => {
    console.log('🔄 useCreateEntities: Создание бренда:', brandName);
    const response = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: brandName })
    });
    
    const result = await response.json();
    if (!result.ok) throw new Error(result.error);
    
    console.log('✅ useCreateEntities: Бренд создан, ID:', result.data.id);
    return result.data.id;
  };

  const createSupplier = async (supplierName: string): Promise<number> => {
    console.log('🔄 useCreateEntities: Создание поставщика:', supplierName);
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: supplierName })
    });
    
    const result = await response.json();
    if (!result.ok) throw new Error(result.error);
    
    console.log('✅ useCreateEntities: Поставщик создан, ID:', result.data.id);
    return result.data.id;
  };

  return { createBrand, createSupplier };
}