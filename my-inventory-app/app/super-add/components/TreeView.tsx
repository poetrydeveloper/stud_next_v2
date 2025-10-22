//app/super-add/components/TreeView.tsx
//app/super-add/components/TreeView.tsx
import { TreeViewProps, TreeNode } from '../types';

export default function TreeView({ tree, selectedPath, onSelect }: TreeViewProps) {
  console.log('🔍 TreeView: Рендер дерева', { tree, selectedPath });
  
  return (
    <div className="max-h-96 overflow-y-auto">
      {Object.keys(tree).length === 0 ? (
        <p className="text-gray-500 text-center py-8">Дерево пустое. Создайте первую категорию.</p>
      ) : (
        <RenderTree 
          node={tree} 
          level={0} 
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

function RenderTree({ node, level, selectedPath, onSelect }: { 
  node: TreeNode; 
  level: number;
  selectedPath: string;
  onSelect: (path: string) => void;
}) {
  return (
    <ul>
      {Object.entries(node).map(([name, data]) => {
        // ФИКС: Проверяем что path существует
        const nodePath = data.path || '';
        console.log('📁 TreeView node:', { name, path: nodePath, type: data.type });
        
        return (
          <li key={name} className="my-1">
            <div className="flex items-center">
              <div style={{ width: `${level * 16}px` }}></div>
              <button
                onClick={() => nodePath && onSelect(nodePath)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  selectedPath === nodePath 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : data.type === 'category' ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' :
                      data.type === 'spine' ? 'bg-green-50 hover:bg-green-100 text-green-700' :
                      'bg-purple-50 hover:bg-purple-100 text-purple-700'
                }`}
                disabled={!nodePath}
              >
                {name}
              </button>
            </div>
            {data.children && Object.keys(data.children).length > 0 && (
              <div className="ml-6 border-l border-gray-200 pl-2">
                <RenderTree 
                  node={data.children} 
                  level={level + 1} 
                  selectedPath={selectedPath}
                  onSelect={onSelect}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}