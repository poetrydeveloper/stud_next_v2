// app/api/miller-columns/page-data/route.ts
import { NextResponse } from "next/server";
import { MillerTreeBuilder } from "@/lib/helpers/miller-tree-builder";

export async function GET() {
  const treeBuilder = new MillerTreeBuilder();
  
  try {
    console.log("🌳 Loading Miller Columns page data (recursive)...");
    
    // Строим полное дерево рекурсивно через хелпер
    const treeData = await treeBuilder.buildCategoryTree();
    const stats = treeBuilder.getStats();

    // ВАЖНАЯ ДИАГНОСТИКА: проверяем ЧТО возвращает хелпер
    console.log('🔍 MillerTreeBuilder returned:', {
      dataLength: treeData.length,
      firstItem: treeData[0] ? {
        name: treeData[0].name,
        type: treeData[0].type,
        hasChildren: treeData[0].hasChildren,
        childrenTypes: treeData[0].children?.map(c => c.type)
      } : 'No data'
    });

    // Глубокая диагностика структуры
    console.log('🔍 DEEP DIAGNOSTIC - Full tree structure:');
    const analyzeTree = (nodes: any[], level = 0) => {
      nodes.forEach(node => {
        const indent = '  '.repeat(level);
        const icon = node.type === 'category' ? '📁' : node.type === 'spine' ? '🌿' : '📦';
        console.log(`${indent}${icon} ${node.type} "${node.name}" (children: ${node.children?.length || 0})`);
        
        // Особенно проверяем spine'ы
        if (node.type === 'spine') {
          console.log(`${indent}  🎯 SPINE DETAIL: ${node.children?.length || 0} products`);
          node.children?.forEach((child: any, index: number) => {
            console.log(`${indent}    📦 Product ${index + 1}: "${child.name}" (type: ${child.type})`);
          });
        }
        
        if (node.children) {
          analyzeTree(node.children, level + 1);
        }
      });
    };
    
    analyzeTree(treeData);

    return NextResponse.json({
      success: true,
      data: treeData,
      stats: {
        totalCategories: treeData.length,
        totalSpines: stats.totalSpines,
        totalProducts: stats.totalProducts
      }
    });

  } catch (error) {
    console.error("❌ Miller Columns page data error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to load catalog data" 
    }, { status: 500 });
  } finally {
    treeBuilder.resetCounters();
  }
}