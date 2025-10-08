import React from 'react';
import type { ValueType } from '../../types/values';

interface ValueTypeSelectorProps {
  onSelectType: (type: ValueType) => void;
  currentType?: ValueType;
}

/**
 * Component for selecting the type of value (simple, array, or object)
 * Displayed when creating a new value or switching between types
 */
export const ValueTypeSelector: React.FC<ValueTypeSelectorProps> = ({
  onSelectType,
  currentType
}) => {
  const options = [
    {
      type: 'simple' as ValueType,
      icon: '📝',
      label: 'Simple Value',
      description: 'Number, string, boolean, or expression',
      example: '42, "hello", True'
    },
    {
      type: 'array' as ValueType,
      icon: '📋',
      label: 'Array',
      description: 'Ordered list of values',
      example: '[1, 2, 3]'
    },
    {
      type: 'object' as ValueType,
      icon: '📦',
      label: 'Object',
      description: 'Key-value pairs',
      example: '{"name": "John"}'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Choose Value Type:
      </label>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelectType(option.type)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${currentType === option.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                <div className="text-xs text-gray-500 mt-1 font-mono">{option.example}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
