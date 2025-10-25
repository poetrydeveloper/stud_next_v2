// // /app/inventory/3d-view/hooks/transformers/dataTransformer.ts

// import { CategoryCube, SpineCube, ProductUnitCube, RequestLine, SalesPlane } from '../../types/inventory3d'
// import { calculateVisualStatus, getColorByStatus, shouldPulse } from './statusUtils'

// interface PrismaData {
//   categories: any[]
//   allUnits: any[]
//   activeRequests: any[]
// }

// export const transformTo3DStructure = (prismaData: PrismaData) => {
//   const { categories, allUnits, activeRequests } = prismaData

//   // Трансформация категорий
//   const categoryCubes = transformCategories(categories)
  
//   // Трансформация spines
//   const { spineCubes, spineMap } = transformSpines(categories, categoryCubes)
  
//   // Трансформация product units
//   const { productUnitCubes, soldUnits } = transformProductUnits(allUnits, spineCubes, spineMap)
  
//   // Трансформация линий поставок
//   const requestLines = transformRequestLines(activeRequests, productUnitCubes)
  
//   // Создание плоскости продаж
//   const salesPlane = createSalesPlane(soldUnits)

//   return {
//     categories: categoryCubes,
//     spines: spineCubes,
//     productUnits: productUnitCubes,
//     requestLines,
//     salesPlane
//   }
// }

// // Трансформация категорий
// const transformCategories = (categories: any[]): CategoryCube[] => {
//   const categoryCubes: CategoryCube[] = []
//   let categoryY = 0
  
//   categories.forEach((rootCategory, rootIndex) => {
//     // Корневая категория
//     const rootCategoryCube: CategoryCube = {
//       id: rootCategory.id,
//       name: rootCategory.name,
//       path: rootCategory.name,
//       position: { x: rootIndex * 15, y: categoryY, z: 0 },
//       size: { x: 12, y: 8, z: 12 },
//       color: `hsl(${rootIndex * 60}, 70%, 20%)`,
//       spines: []
//     }
//     categoryCubes.push(rootCategoryCube)

//     // Подкатегории первого уровня
//     transformChildCategories(rootCategory.children, rootIndex, categoryY, categoryCubes, rootCategory.name)
    
//     categoryY -= 10
//   })

//   return categoryCubes
// }

// // Трансформация дочерних категорий
// const transformChildCategories = (
//   children: any[], 
//   rootIndex: number, 
//   categoryY: number, 
//   categoryCubes: CategoryCube[],
//   parentName: string
// ) => {
//   children?.forEach((child1: any, child1Index: number) => {
//     const child1Cube: CategoryCube = {
//       id: child1.id,
//       name: child1.name,
//       path: `${parentName} > ${child1.name}`,
//       position: { 
//         x: rootIndex * 15 + (child1Index - 1) * 8, 
//         y: categoryY - 3, 
//         z: 0 
//       },
//       size: { x: 6, y: 4, z: 6 },
//       color: `hsl(${rootIndex * 60}, 70%, 30%)`,
//       spines: []
//     }
//     categoryCubes.push(child1Cube)

//     // Подкатегории второго уровня
//     child1.children?.forEach((child2: any, child2Index: number) => {
//       const child2Cube: CategoryCube = {
//         id: child2.id,
//         name: child2.name,
//         path: `${parentName} > ${child1.name} > ${child2.name}`,
//         position: { 
//           x: rootIndex * 15 + (child1Index - 1) * 8 + (child2Index - 0.5) * 4, 
//           y: categoryY - 5, 
//           z: 0 
//         },
//         size: { x: 3, y: 2, z: 3 },
//         color: `hsl(${rootIndex * 60}, 70%, 40%)`,
//         spines: []
//       }
//       categoryCubes.push(child2Cube)
//     })
//   })
// }
// /app/inventory/3d-view/hooks/transformers/dataTransformer.ts

import { CategoryCube, SpineCube, ProductUnitCube, RequestLine, SalesPlane } from '../../types/inventory3d'
import { transformSpines } from './spineUnitTransformer'
import { transformProductUnits } from './spineUnitTransformer'
import { transformRequestLines, createSalesPlane } from './requestSalesTransformer'

interface PrismaData {
  categories: any[]
  allUnits: any[]
  activeRequests: any[]
}

export const transformTo3DStructure = (prismaData: PrismaData) => {
  const { categories, allUnits, activeRequests } = prismaData

  // Трансформация категорий
  const categoryCubes = transformCategories(categories)
  
  // Трансформация spines
  const { spineCubes, spineMap } = transformSpines(categories, categoryCubes)
  
  // Трансформация product units
  const { productUnitCubes, soldUnits } = transformProductUnits(allUnits, spineCubes, spineMap)
  
  // Трансформация линий поставок
  const requestLines = transformRequestLines(activeRequests, productUnitCubes)
  
  // Создание плоскости продаж
  const salesPlane = createSalesPlane(soldUnits)

  return {
    categories: categoryCubes,
    spines: spineCubes,
    productUnits: productUnitCubes,
    requestLines,
    salesPlane
  }
}

// Трансформация категорий
const transformCategories = (categories: any[]): CategoryCube[] => {
  const categoryCubes: CategoryCube[] = []
  let categoryY = 0
  
  categories.forEach((category, index) => {
    // Основная категория
    const categoryCube: CategoryCube = {
      id: category.id,
      name: category.name,
      path: category.name,
      position: { x: index * 15, y: categoryY, z: 0 },
      size: { x: 12, y: 8, z: 12 },
      color: `hsl(${index * 60}, 70%, 20%)`,
      spines: []
    }
    categoryCubes.push(categoryCube)
    
    categoryY -= 10
  })

  return categoryCubes
}