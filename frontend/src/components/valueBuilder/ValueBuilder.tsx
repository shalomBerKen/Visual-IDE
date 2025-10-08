import React, { useState } from 'react';
import type { ComplexValue, ValueType } from '../../types/values';
import { createSimpleValue, createArrayValue, createObjectValue } from '../../types/values';
import { ValueTypeSelector } from './ValueTypeSelector';
import { SimpleValueEditor } from './SimpleValueEditor';
import { ArrayValueEditor } from './ArrayValueEditor';
import { ObjectValueEditor } from './ObjectValueEditor';
import { Modal } from '../common/Modal';

interface ValueBuilderProps {
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
  availableVariables?: string[];
  showTypeSelector?: boolean;
}

/**
 * Main component for building complex values
 * Recursively handles simple values, arrays, and objects
 */
export const ValueBuilder: React.FC<ValueBuilderProps> = ({
  value,
  onChange,
  availableVariables = [],
  showTypeSelector = false
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showTypeSwitcher, setShowTypeSwitcher] = useState(showTypeSelector);

  const handleChangeType = (newType: ValueType) => {
    let newValue: ComplexValue;

    switch (newType) {
      case 'simple':
        newValue = createSimpleValue('');
        break;
      case 'array':
        newValue = createArrayValue([]);
        break;
      case 'object':
        newValue = createObjectValue([]);
        break;
    }

    onChange(newValue);
    setShowTypeSwitcher(false);
  };

  const handleEditArrayItem = (index: number) => {
    setEditingIndex(index);
  };

  const handleEditObjectProperty = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveNestedValue = (newValue: ComplexValue) => {
    if (editingIndex === null) return;

    if (value.type === 'array') {
      const newItems = [...value.items];
      newItems[editingIndex] = newValue;
      onChange({ ...value, items: newItems });
    } else if (value.type === 'object') {
      const newProperties = [...value.properties];
      newProperties[editingIndex] = {
        ...newProperties[editingIndex],
        value: newValue
      };
      onChange({ ...value, properties: newProperties });
    }

    setEditingIndex(null);
  };

  const getNestedValue = (): ComplexValue | null => {
    if (editingIndex === null) return null;

    if (value.type === 'array') {
      return value.items[editingIndex] || null;
    } else if (value.type === 'object') {
      return value.properties[editingIndex]?.value || null;
    }

    return null;
  };

  const nestedValue = getNestedValue();

  return (
    <>
      <div className="space-y-4">
        {/* Type Selector (shown initially or when switching) */}
        {showTypeSwitcher ? (
          <ValueTypeSelector
            onSelectType={handleChangeType}
            currentType={value.type}
          />
        ) : (
          <>
            {/* Current Editor based on type */}
            {value.type === 'simple' && (
              <SimpleValueEditor
                value={value}
                onChange={onChange}
                availableVariables={availableVariables}
                autoFocus
              />
            )}

            {value.type === 'array' && (
              <ArrayValueEditor
                value={value}
                onChange={onChange}
                onEditItem={handleEditArrayItem}
                availableVariables={availableVariables}
              />
            )}

            {value.type === 'object' && (
              <ObjectValueEditor
                value={value}
                onChange={onChange}
                onEditProperty={handleEditObjectProperty}
                availableVariables={availableVariables}
              />
            )}

            {/* Type Switcher Buttons */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Switch value type:</div>
              <div className="flex gap-2">
                {value.type !== 'simple' && (
                  <button
                    onClick={() => handleChangeType('simple')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  >
                    → Simple Value
                  </button>
                )}
                {value.type !== 'array' && (
                  <button
                    onClick={() => handleChangeType('array')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  >
                    → Array
                  </button>
                )}
                {value.type !== 'object' && (
                  <button
                    onClick={() => handleChangeType('object')}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  >
                    → Object
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Nested Value Editor Modal */}
      {editingIndex !== null && nestedValue && (
        <Modal
          isOpen={true}
          onClose={() => setEditingIndex(null)}
          title={
            value.type === 'array'
              ? `Edit Array Item [${editingIndex}]`
              : `Edit Property: ${value.properties[editingIndex]?.key}`
          }
          size="lg"
        >
          <div className="space-y-4">
            <ValueBuilder
              value={nestedValue}
              onChange={handleSaveNestedValue}
              availableVariables={availableVariables}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => setEditingIndex(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
