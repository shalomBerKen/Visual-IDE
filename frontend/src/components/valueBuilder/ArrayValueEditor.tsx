import React, { useState } from 'react';
import type { ArrayValue, ComplexValue } from '../../types/values';
import { createSimpleValue } from '../../types/values';
import { getValueDisplayString } from '../../utils/valueUtils';

interface ArrayValueEditorProps {
  value: ArrayValue;
  onChange: (value: ArrayValue) => void;
  onEditItem?: (index: number) => void;
  availableVariables?: string[];
}

/**
 * Component for editing an array value
 * Allows adding, removing, and editing items
 */
export const ArrayValueEditor: React.FC<ArrayValueEditorProps> = ({
  value,
  onChange,
  onEditItem,
  availableVariables = []
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddItem = (type: 'simple' | 'array' | 'object') => {
    const newItem: ComplexValue =
      type === 'simple' ? createSimpleValue('') :
      type === 'array' ? { type: 'array', items: [] } :
      { type: 'object', properties: [] };

    onChange({
      ...value,
      items: [...value.items, newItem]
    });
    setShowAddMenu(false);

    // Auto-open editor for the new item
    if (onEditItem) {
      // Use setTimeout to ensure state update completes first
      setTimeout(() => onEditItem(value.items.length), 0);
    }
  };

  const handleRemoveItem = (index: number) => {
    onChange({
      ...value,
      items: value.items.filter((_, i) => i !== index)
    });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...value.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) {
      return;
    }

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    onChange({
      ...value,
      items: newItems
    });
  };

  const getItemIcon = (item: ComplexValue) => {
    switch (item.type) {
      case 'simple': return '📝';
      case 'array': return '📋';
      case 'object': return '📦';
    }
  };

  const getItemTypeLabel = (item: ComplexValue) => {
    switch (item.type) {
      case 'simple': return 'Simple';
      case 'array': return `Array [${item.items.length}]`;
      case 'object': return `Object {${item.properties.length}}`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Array Items ({value.items.length})
        </label>
      </div>

      {/* Items List */}
      {value.items.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {value.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
            >
              {/* Index */}
              <span className="text-xs font-mono text-gray-500 w-8">[{index}]</span>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getItemIcon(item)}</span>
                  <span className="text-xs text-gray-600">{getItemTypeLabel(item)}</span>
                </div>
                <div className="text-sm text-gray-900 font-mono truncate">
                  {getValueDisplayString(item, 40)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {/* Move Up */}
                <button
                  onClick={() => handleMoveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  ▲
                </button>

                {/* Move Down */}
                <button
                  onClick={() => handleMoveItem(index, 'down')}
                  disabled={index === value.items.length - 1}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  ▼
                </button>

                {/* Edit */}
                {onEditItem && (
                  <button
                    onClick={() => onEditItem(index)}
                    className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                    title="Edit item"
                  >
                    Edit
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
                  title="Delete item"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded">
          Empty array - click "Add Item" to start
        </div>
      )}

      {/* Add Item Button/Menu */}
      {!showAddMenu ? (
        <button
          onClick={() => setShowAddMenu(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + Add Item
        </button>
      ) : (
        <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
          <div className="text-sm font-medium text-gray-700 mb-2">Choose item type:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAddItem('simple')}
              className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              📝 Simple
            </button>
            <button
              onClick={() => handleAddItem('array')}
              className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              📋 Array
            </button>
            <button
              onClick={() => handleAddItem('object')}
              className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
              📦 Object
            </button>
          </div>
          <button
            onClick={() => setShowAddMenu(false)}
            className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
