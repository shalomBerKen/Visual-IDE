import React, { useState } from 'react';
import type { BlockColor } from './EditableField';

interface TagListProps {
  items: string[];
  color: BlockColor;
  onRemove: (index: number) => void;
  onAdd?: (item: string) => void;
  addPlaceholder?: string;
  addButtonText?: string;
}

const colorClasses: Record<BlockColor, { bg: string; text: string; button: string }> = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    button: 'bg-blue-500 hover:bg-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    button: 'bg-green-500 hover:bg-green-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    button: 'bg-purple-500 hover:bg-purple-600'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    button: 'bg-orange-500 hover:bg-orange-600'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    button: 'bg-red-500 hover:bg-red-600'
  },
  cyan: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    button: 'bg-cyan-500 hover:bg-cyan-600'
  }
};

/**
 * Component for displaying and managing a list of tags/items
 * Used for parameters, arguments, etc.
 */
export const TagList: React.FC<TagListProps> = ({
  items,
  color,
  onRemove,
  onAdd,
  addPlaceholder = 'Add item...',
  addButtonText = 'Add'
}) => {
  const [newItem, setNewItem] = useState('');
  const colors = colorClasses[color];

  const handleAdd = () => {
    if (newItem.trim() && onAdd) {
      onAdd(newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing items */}
      {items.map((item, index) => (
        <div
          key={index}
          className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm flex items-center gap-2 w-fit`}
        >
          <span>{item}</span>
          <button
            onClick={() => onRemove(index)}
            className="text-current hover:text-red-600 font-bold transition-colors"
            type="button"
          >
            ×
          </button>
        </div>
      ))}

      {/* Add new item */}
      {onAdd && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={addPlaceholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-current text-sm"
          />
          <button
            onClick={handleAdd}
            className={`px-4 py-2 ${colors.button} text-white rounded-md transition-colors text-sm`}
            type="button"
          >
            {addButtonText}
          </button>
        </div>
      )}
    </div>
  );
};
