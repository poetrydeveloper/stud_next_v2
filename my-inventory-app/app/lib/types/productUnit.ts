//app/lib/types/productUnits.ts
export type ProductUnitStatus = 'IN_STORE' | 'SOLD' | 'LOST';
export type ItemStatus = 'CANDIDATE' | 'IN_REQUEST' | 'EXTRA';
export type DeliveryStatus = 'PARTIAL' | 'OVER' | 'FULL' | 'EXTRA';

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  parent: Category | null;
  children: Category[];
}

export interface ProductImage {
  id: number;
  productId: number;
  filename: string;
  path: string;
  isMain: boolean;
  createdAt: Date;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  categoryId: number | null;
  category: Category | null;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: number;
  createdAt: Date;
  notes: string | null;
}

export interface RequestItem {
  id: number;
  requestId: number | null;
  request: Request | null;
  productId: number;
  product: Product;
  status: ItemStatus;
  quantity: number;
  deliveredQuantity: number;
  isCompleted: boolean;
  pricePerUnit: number;
  supplierId: number | null;
  supplier: Supplier | null;
  customerId: number | null;
  customer: Customer | null;
  deliveries: Delivery[];
}

export interface Delivery {
  id: number;
  requestItemId: number;
  requestItem: RequestItem;
  deliveryDate: Date;
  quantity: number;
  status: DeliveryStatus;
  extraShipment: boolean;
  notes: string | null;
  supplierName: string;
  customerName: string;
  productId: number;
  product: Product;
  requestDate: Date;
  extraRequest: boolean;
  pricePerUnit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductUnit {
  id: number;
  serialNumber: string;
  productId: number;
  product: Product;
  deliveryId: number;
  delivery: Delivery;
  status: ProductUnitStatus;
  salePrice: number | null;
  soldAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductUnitRequest {
  productId: number;
  deliveryId: number;
  quantity?: number;
}

export interface UpdateProductUnitRequest {
  status?: ProductUnitStatus;
  salePrice?: number;
}
