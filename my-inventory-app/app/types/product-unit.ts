// types/product-unit.ts
export interface ProductImage {
  id: number;
  path: string;
  isMain: boolean;
}

export interface Spine {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description?: string;
  images?: ProductImage[];
  spine?: Spine;
  category?: Category;
}

export interface ProductUnit {
  id: number;
  serialNumber: string;
  productName?: string;
  product?: Product;
  salePrice?: number;
  purchasePrice?: number;
  statusProduct?: 'IN_STORE' | 'SOLD' | 'CREDIT' | 'LOST' | 'RETURNED';
  statusCard?: 'CANDIDATE' | 'CLEAR' | 'SPROUTED' | 'IN_REQUEST' | 'IN_DELIVERY';
  isReturned?: boolean;
  returnedAt?: string;
  soldAt?: string;
  buyerName?: string;
  buyerPhone?: string;
  isCredit?: boolean;
  creditPaidAt?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  deliveryId?: number;
  quantityInCandidate?: number;
  createdAtCandidate?: string;
}

export interface CandidateUnit extends ProductUnit {
  quantityInCandidate: number;
  createdAtCandidate: string;
  statusCard: 'CANDIDATE';
}

export interface ProductUnitFormData {
  productId: string;
  categoryId: string;
  spineId: string;
  deliveryId: string;
  serialNumber: string;
  purchasePrice: string;
  salePrice: string;
  notes: string;
}