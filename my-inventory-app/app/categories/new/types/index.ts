// app/categories/new/types/index.ts
export interface Category {
  id: number;
  name: string;
  path: string;
  children?: Category[];
}

export interface FlatCategory {
  id: number;
  name: string;
  path: string;
}