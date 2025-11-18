// app/lib/node-index/SpineProductMigrationService.ts
export class SpineProductMigrationService {
  
  async migrateExistingSpines(): Promise<MigrationReport> {
    const spines = await prisma.spine.findMany({
      include: { category: true }
    });
    
    const report: MigrationReport = {
      total: spines.length,
      migrated: 0,
      errors: []
    };
    
    for (const spine of spines) {
      try {
        await this.migrateSingleSpine(spine);
        report.migrated++;
      } catch (error) {
        report.errors.push({
          spineId: spine.id,
          spineName: spine.name,
          error: error.message
        });
      }
    }
    
    return report;
  }
  
  async migrateExistingProducts(): Promise<MigrationReport> {
    const products = await prisma.product.findMany({
      include: { spine: { include: { category: true } } }
    });
    
    const report: MigrationReport = {
      total: products.length,
      migrated: 0,
      errors: []
    };
    
    for (const product of products) {
      try {
        await this.migrateSingleProduct(product);
        report.migrated++;
      } catch (error) {
        report.errors.push({
          productId: product.id,
          productName: product.name,
          error: error.message
        });
      }
    }
    
    return report;
  }
  
  private async migrateSingleSpine(spine: Spine & { category: Category }): Promise<void> {
    if (!spine.category) {
      console.warn(`Spine ${spine.id} не имеет категории, пропускаем`);
      return;
    }
    
    const indexes = await nodeIndexService.generateSpineIndex(
      spine.category,
      spine.slug,
      spine.name
    );
    
    await prisma.spine.update({
      where: { id: spine.id },
      data: {
        node_index: indexes.node_index,
        human_path: indexes.human_path
      }
    });
  }
  
  private async migrateSingleProduct(product: Product & { spine: Spine & { category: Category } }): Promise<void> {
    if (!product.spine) {
      console.warn(`Product ${product.id} не имеет spine, пропускаем`);
      return;
    }
    
    const indexes = await nodeIndexService.generateProductIndex(
      product.spine,
      product.code,
      product.name
    );
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        node_index: indexes.node_index,
        human_path: indexes.human_path
      }
    });
  }
}