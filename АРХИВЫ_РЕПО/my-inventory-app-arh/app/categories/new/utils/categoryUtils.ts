// app/categories/new/utils/categoryUtils.ts
import { Category } from "../types";

export function countAllCategories(categories: Category[]): number {
  let count = 0;
  
  function countRecursive(cats: Category[]) {
    cats.forEach(cat => {
      count++;
      if (cat.children && cat.children.length > 0) {
        countRecursive(cat.children);
      }
    });
  }
  
  countRecursive(categories);
  return count;
}