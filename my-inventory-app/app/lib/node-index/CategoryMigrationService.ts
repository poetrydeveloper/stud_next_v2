// app/lib/node-index/CategoryMigrationService.ts
export class CategoryMigrationService {
  
  async migrateExistingCategories(): Promise<MigrationReport> {
    const categories = await prisma.category.findMany({
      orderBy: { path: 'asc' }
    });
    
    const report: MigrationReport = {
      total: categories.length,
      migrated: 0,
      errors: []
    };
    
    for (const category of categories) {
      try {
        await this.migrateSingleCategory(category);
        report.migrated++;
      } catch (error) {
        report.errors.push({
          categoryId: category.id,
          categoryName: category.name,
          error: error.message
        });
      }
    }
    
    return report;
  }
  
  private async migrateSingleCategory(category: Category): Promise<void> {
    // Преобразуем существующий path в новый node_index
    const nodeIndex = this.convertPathToNodeIndex(category.path);
    
    // Создаем human_path из path
    const humanPath = await this.convertPathToHumanPath(category.path);
    
    // Находим parent_id из path
    const parentId = await this.extractParentIdFromPath(category.path);
    
    await prisma.category.update({
      where: { id: category.id },
      data: {
        node_index: nodeIndex,
        human_path: humanPath,
        parent_id: parentId
      }
    });
  }
  
  private convertPathToNodeIndex(path: string): string {
    // Конвертируем "/ruchnoy-instrument/bity/10mm-dlinnye" 
    // в "0_1V01_2V03_3V01"
    const parts = path.split('/').filter(Boolean);
    
    let nodeIndex = "0";
    parts.forEach((slug, index) => {
      // Здесь логика преобразования slug в номер ветки
      // Пока используем простую нумерацию
      const level = index + 1;
      const branchNumber = (index + 1).toString().padStart(2, '0');
      nodeIndex += `_${level}V${branchNumber}`;
    });
    
    return nodeIndex;
  }
}