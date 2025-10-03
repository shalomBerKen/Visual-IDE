import React, { ReactNode } from 'react';

interface BlockFieldListProps<T> {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  addButtonText?: string;
  addButtonColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  emptyText?: string;
}

const buttonColorClasses = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  red: 'bg-red-100 text-red-700 hover:bg-red-200',
  cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
};

/**
 * Unified component for dynamic lists in blocks
 * Used for parameters, arguments, etc.
 */
export function BlockFieldList<T>({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
  addButtonText = '+ Add',
  addButtonColor = 'blue',
  emptyText = 'No items',
}: BlockFieldListProps<T>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          onClick={onAdd}
          className={`px-3 py-1 ${buttonColorClasses[addButtonColor]} rounded-md transition-colors text-xs font-medium`}
        >
          {addButtonText}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-400 italic pl-6">{emptyText}</div>
      ) : (
        <div className="space-y-2 pl-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {renderItem(item, index)}
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Remove"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
