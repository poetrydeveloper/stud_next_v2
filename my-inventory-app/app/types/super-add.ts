export interface SuperAddData {
  category?: {
    name: string;
  };
  spine?: {
    name: string;
  };
  product: {
    name: string;
    code: string;
    description?: string;
    brandId?: number;
  };
  unitOptions: {
    createUnit: boolean;
    makeCandidate: boolean;
    supplierId?: number;
    requestPricePerUnit?: number;
  };
  requestOptions?: {
    quantity: number;
    pricePerUnit: number;
  };
}

export interface SuperAddResponse {
  ok: boolean;
  data: {
    category: { 
      id: number; 
      name: string;
      node_index?: string;
    } | null;
    spine: { 
      id: number; 
      name: string;
      node_index?: string;
    } | null;
    product: {
      id: number;
      name: string;
      code: string;
      description?: string;
      node_index?: string;
      human_path?: string;
      brand?: {
        id: number;
        name: string;
      };
      category?: {
        id: number;
        name: string;
      };
      spine?: {
        id: number;
        name: string;
      };
    };
    unit: any | null;
    request: any | null;
  };
  message: string;
}

export interface TreeData {
  categories: CategoryNode[];
  spines: SpineNode[];
}

export interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  path: string;
  node_index?: string;
  human_path?: string;
  parent_id?: number | null;
  children?: CategoryNode[];
  spines?: SpineNode[];
}

export interface SpineNode {
  id: number;
  name: string;
  slug: string;
  node_index?: string;
  human_path?: string;
  categoryId?: number;
  products?: ProductNode[];
}

export interface ProductNode {
  id: number;
  name: string;
  code: string;
  description?: string;
  node_index?: string;
  human_path?: string;
  brand?: { 
    id: number;
    name: string; 
  };
  images?: {
    id: number;
    path: string;
    isMain: boolean;
  }[];
}

export interface SelectedNode {
  type: 'category' | 'spine' | 'product';
  id: number;
  name: string;
  data?: CategoryNode | SpineNode | ProductNode;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Supplier {
  id: number;
  name: string;
}