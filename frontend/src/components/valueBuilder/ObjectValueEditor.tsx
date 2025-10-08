import React, { useState } from 'react';
import type { ObjectValue, ComplexValue, ObjectProperty } from '../../types/values';
import { createSimpleValue } from '../../types/values';
import { getValueDisplayString, validateObjectKeys } from '../../utils/valueUtils';

interface ObjectValueEditorProps {
  value: ObjectValue;
  onChange: (value: ObjectValue) => void;
  onEditProperty?: (index: number) => void;
  availableVariables?: string[];
}

/**
 * Component for editing an object value
 * Allows adding, removing, and editing properties
 */
export const ObjectValueEditor: React.FC<ObjectValueEditorProps> = ({
  value,
  onChange,
  onEditProperty,
  availableVariables = []
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newPropertyKey, setNewPropertyKey] = useState('');

  const validation = validateObjectKeys(value);

  const handleAddProperty = (type: 'simple' | 'array' | 'object') => {
    if (!newPropertyKey.trim()) {
      return;
    }

    const newValue: ComplexValue =
      type === 'simple' ? createSimpleValue('') :
      type === 'array' ? { type: 'array', items: [] } :
      { type: 'object', properties: [] };

    const newProperty: ObjectProperty = {
      key: newPropertyKey.trim(),
      value: newValue
    };

    onChange({
      ...value,
      properties: [...value.properties, newProperty]
    });

    setNewPropertyKey('');
    setShowAddMenu(false);

    // Auto-open editor for the new property
    if (onEditProperty) {
      setTimeout(() => onEditProperty(value.properties.length), 0);
    }
  };

  const handleRemoveProperty = (index: number) => {
    onChange({
      ...value,
      properties: value.properties.filter((_, i) => i !== index)
    });
  };

  const handleMoveProperty = (index: number, direction: 'up' | 'down') => {
    const newProperties = [...value.properties];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newProperties.length) {
      return;
    }

    [newProperties[index], newProperties[targetIndex]] = [newProperties[targetIndex], newProperties[index]];

    onChange({
      ...value,
      properties: newProperties
    });
  };

  const handleUpdateKey = (index: number, newKey: string) => {
    const newProperties = [...value.properties];
    newProperties[index] = { ...newProperties[index], key: newKey };
    onChange({
      ...value,
      properties: newProperties
    });
  };

  const getValueIcon = (val: ComplexValue) => {
    switch (val.type) {
      case 'simple': return '📝';
      case 'array': return '📋';
      case 'object': return '📦';
    }
  };

  const getValueTypeLabel = (val: ComplexValue) => {
    switch (val.type) {
      case 'simple': return 'Simple';
      case 'array': return `Array [${val.items.length}]`;
      case 'object': return `Object {${val.properties.length}}`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Object Properties ({value.properties.length})
        </label>
        {!validation.valid && (
          <span className="text-xs text-red-600">
            ⚠️ Duplicate keys: {validation.duplicateKeys.join(', ')}
          </span>
        )}
      </div>

      {/* Properties List */}
      {value.properties.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {value.properties.map((prop, index) => {
            const isDuplicate = validation.duplicateKeys.includes(prop.key);

            return (
              <div
                key={index}
                className={`p-2 rounded border ${
                  isDuplicate ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Key Input */}
                  <div className="flex-shrink-0" style={{ width: '120px' }}>
                    <input
                      type="text"
                      value={prop.key}
                      onChange={(e) => handleUpdateKey(index, e.target.value)}
                      placeholder="key"
                      className={`w-full px-2 py-1 text-sm border rounded font-mono ${
                        isDuplicate ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <span className="text-gray-400 pt-1">→</span>

                  {/* Value Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getValueIcon(prop.value)}</span>
                      <span className="text-xs text-gray-600">{getValueTypeLabel(prop.value)}</span>
                    </div>
                    <div className="text-sm text-gray-900 font-mono truncate">
                      {getValueDisplayString(prop.value, 30)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveProperty(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ▲
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveProperty(index, 'down')}
                      disabled={index === value.properties.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ▼
                    </button>

                    {/* Edit */}
                    {onEditProperty && (
                      <button
                        onClick={() => onEditProperty(index)}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
                        title="Edit value"
                      >
                        Edit
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleRemoveProperty(index)}
                      className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
                      title="Delete property"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded">
          Empty object - click "Add Property" to start
        </div>
      )}

      {/* Add Property Button/Menu */}
      {!showAddMenu ? (
        <button
          onClick={() => setShowAddMenu(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + Add Property
        </button>
      ) : (
        <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Property Key:</label>
              <input
                type="text"
                value={newPropertyKey}
                onChange={(e) => setNewPropertyKey(e.target.value)}
                placeholder="e.g., name, age, items"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                autoFocus
              />
            </div>

            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">Value type:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddProperty('simple')}
                  disabled={!newPropertyKey.trim()}
                  className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📝 Simple
                </button>
                <button
                  onClick={() => handleAddProperty('array')}
                  disabled={!newPropertyKey.trim()}
                  className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📋 Array
                </button>
                <button
                  onClick={() => handleAddProperty('object')}
                  disabled={!newPropertyKey.trim()}
                  className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📦 Object
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddMenu(false);
              setNewPropertyKey('');
            }}
            className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
