import React from 'react';
import type { SimpleValue } from '../../types/values';

interface SimpleValueEditorProps {
  value: SimpleValue;
  onChange: (value: SimpleValue) => void;
  availableVariables?: string[];
  onVariableClick?: (variable: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Component for editing a simple value (string, number, boolean, expression)
 * Similar to the existing value input but specifically for SimpleValue type
 */
export const SimpleValueEditor: React.FC<SimpleValueEditorProps> = ({
  value,
  onChange,
  availableVariables = [],
  onVariableClick,
  placeholder = 'e.g., 42, "hello", True, x + 5',
  autoFocus = false
}) => {
  const handleChange = (newValue: string) => {
    onChange({
      type: 'simple',
      value: newValue
    });
  };

  const handleVariableClick = (variable: string) => {
    const currentValue = value.value;
    const newValue = currentValue + (currentValue ? ' ' : '') + variable;
    handleChange(newValue);

    if (onVariableClick) {
      onVariableClick(variable);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value
        </label>
        <input
          type="text"
          value={value.value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          autoFocus={autoFocus}
        />
        <p className="text-xs text-gray-500 mt-1">
          Numbers, strings (in quotes), booleans (True/False), or expressions
        </p>
      </div>

      {availableVariables.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Variables
          </label>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <button
                key={variable}
                onClick={() => handleVariableClick(variable)}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                type="button"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
