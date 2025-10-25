// В /app/inventory/3d-view/hooks/transformers/spineUnitTransformer.ts

export const transformProductUnits = (
  allUnits: any[], 
  spineCubes: SpineCube[], 
  spineMap: Map<number, SpineCube>
) => {
  const productUnitCubes: ProductUnitCube[] = []
  const soldUnits: ProductUnitCube[] = []
  
  allUnits.forEach((unit) => {
    const spineId = unit.product.spineId
    const spineCube = spineMap.get(spineId)
    if (!spineCube) return

    const visualStatus = calculateVisualStatus(unit)
    if (visualStatus === 'HIDDEN') return

    const position = calculateUnitPosition(spineCube, spineCubes, spineId)

    const productUnitCube: ProductUnitCube = {
      id: unit.id,
      serialNumber: unit.serialNumber,
      productId: unit.productId,
      productName: unit.product.name,
      brandName: unit.product.brand?.name || unit.product.brand || 'Unknown',
      price: unit.product.price,
      disassemblyStatus: unit.disassemblyStatus,
      cardStatus: unit.cardStatus,
      physicalStatus: unit.physicalStatus,
      position,
      size: { x: 0.5, y: 0.5, z: 0.5 },
      color: getColorByStatus(visualStatus),
      pulse: shouldPulse(unit),
      quantity: 1,
      spineId: spineId
    }

    if (visualStatus === 'SOLD' || visualStatus === 'CREDIT') {
      soldUnits.push(productUnitCube)
    } else {
      productUnitCubes.push(productUnitCube)
      spineCube.productUnits.push(productUnitCube)
    }
  })

  return { productUnitCubes, soldUnits }
}