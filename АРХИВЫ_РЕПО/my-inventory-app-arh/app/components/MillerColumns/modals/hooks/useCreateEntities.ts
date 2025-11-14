// components/MillerColumns/modals/hooks/useCreateEntities.ts
export function useCreateEntities(reloadLists: () => void) {
  const createBrand = async (brandName: string): Promise<number> => {
    const response = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: brandName })
    });
    
    const result = await response.json();
    if (!result.ok && !result.success) throw new Error(result.error);
    
    return result.data?.id || result.id;
  };

  const createSupplier = async (supplierName: string): Promise<number> => {
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: supplierName })
    });
    
    const result = await response.json();
    if (!result.ok && !result.success) throw new Error(result.error);
    
    return result.data?.id || result.id;
  };

  return { createBrand, createSupplier };
}