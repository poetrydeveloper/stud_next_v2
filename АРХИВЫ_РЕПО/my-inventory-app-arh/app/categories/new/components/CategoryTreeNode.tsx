// app/categories/new/components/CategoryTreeNode.tsx
"use client";

import { useState } from "react";

interface Category {
  id: number;
  name: string;
  path: string;
  children?: Category[];
}

interface Props {
  category: Category;
  level: number;
  searchTerm: string;
  selectedCategoryId: number | "";
  lastCreatedCategoryId: number | null;
  onSelect: (categoryId: number | "") => void;
}

export default function CategoryTreeNode({
  category,
  level,
  searchTerm,
  selectedCategoryId,
  lastCreatedCategoryId,
  onSelect
}: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(level < 1); // корни раскрыты по умолч.
  const hasChildren = (category.children && category.children.length > 0);
  const isLastCreated = category.id === lastCreatedCategoryId;
  const isSelected = category.id === selectedCategoryId;

  // простой индикатор уровня (можно убрать)
  const levelIndicators = Array(level)
    .fill(0)
    .map((_, i) => (
      <span key={i} className="text-gray-300 mr-1">|</span>
    ));

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-3 hover:bg-gray-100 rounded cursor-pointer ${
          isSelected ? "bg-blue-50 border border-blue-200" : ""
        } ${isLastCreated ? "bg-red-50 border border-red-200" : ""}`}
        style={{ paddingLeft: `${12 + level * 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-6 h-6 flex items-center justify-center mr-2 text-gray-500 hover:bg-gray-200 rounded"
            aria-label={isExpanded ? "свернуть" : "развернуть"}
            type="button"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <div className="w-6 h-6 mr-2" />
        )}

        <div
          className="flex-1 flex items-center"
          onClick={() => onSelect(category.id)}
        >
          <span className={`text-lg mr-2 ${isLastCreated ? "text-red-500" : ""}`}>📁</span>

          <div className="flex items-center">
            {levelIndicators}
            <span className={`${isLastCreated ? "text-red-600 font-semibold" : ""}`}>
              {category.name}
            </span>
            <span className="ml-3 text-xs text-gray-400">{category.path}</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(category.id)}
          className={`ml-2 px-3 py-1 text-sm rounded transition-colors ${
            isLastCreated ? "bg-red-500 text-white hover:bg-red-600" : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          type="button"
        >
          Выбрать
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {category.children!.map(child => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              level={level + 1}
              searchTerm={searchTerm}
              selectedCategoryId={selectedCategoryId}
              lastCreatedCategoryId={lastCreatedCategoryId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
