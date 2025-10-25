// // /app/inventory/3d-view/hooks/transformers/requestSalesTransformer.ts

// import { RequestLine, SalesPlane, ProductUnitCube } from '../../types/inventory3d'

// export const transformRequestLines = (activeRequests: any[], productUnitCubes: ProductUnitCube[]): RequestLine[] => {
//   const requestLines: RequestLine[] = []
  
//   activeRequests.forEach(request => {
//     request.units.forEach((unit: any, unitIndex: number) => {
//       const unitCube = productUnitCubes.find(pu => pu.id === unit.id)
//       if (!unitCube) return

//       const requestLine: RequestLine = {
//         id: `request-${request.id}-unit-${unit.id}`,
//         from: unitCube.position,
//         to: { 
//           x: 20 + unitIndex * 2, 
//           y: 5, 
//           z: 0 
//         },
//         productUnitId: unit.id,
//         color: '#0099ff'
//       }
//       requestLines.push(requestLine)
//     })
//   })

//   return requestLines
// }

// export const createSalesPlane = (soldUnits: ProductUnitCube[]): SalesPlane => {
//   return {
//     position: { x: 0, y: -8, z: 0 },
//     size: { x: 25, y: 0.1, z: 15 },
//     soldUnits: soldUnits.map((unit, index) => ({
//       ...unit,
//       position: {
//         x: (index % 10 - 5) * 2,
//         y: -7.5,
//         z: Math.floor(index / 10 - 1) * 2
//       }
//     }))
//   }
// }
// /app/inventory/3d-view/hooks/transformers/requestSalesTransformer.ts

import { RequestLine, SalesPlane, ProductUnitCube } from '../../types/inventory3d'

export const transformRequestLines = (activeRequests: any[], productUnitCubes: ProductUnitCube[]): RequestLine[] => {
  const requestLines: RequestLine[] = []
  
  activeRequests.forEach(request => {
    request.units?.forEach((unit: any, unitIndex: number) => {
      const unitCube = productUnitCubes.find(pu => pu.id === unit.id)
      if (!unitCube) return

      const requestLine: RequestLine = {
        id: `request-${request.id}-unit-${unit.id}`,
        from: unitCube.position,
        to: { 
          x: 20 + unitIndex * 2, 
          y: 5, 
          z: 0 
        },
        productUnitId: unit.id,
        color: '#0099ff'
      }
      requestLines.push(requestLine)
    })
  })

  return requestLines
}

export const createSalesPlane = (soldUnits: ProductUnitCube[]): SalesPlane => {
  return {
    position: { x: 0, y: -8, z: 0 },
    size: { x: 25, y: 0.1, z: 15 },
    soldUnits: soldUnits.map((unit, index) => ({
      ...unit,
      position: {
        x: (index % 10 - 5) * 2,
        y: -7.5,
        z: Math.floor(index / 10 - 1) * 2
      }
    }))
  }
}