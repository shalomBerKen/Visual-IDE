import React from 'react';
import type { ComplexValue } from '../../types/values';
import { getValueDisplayString } from '../../utils/valueUtils';

interface ValueDisplayProps {
  value: ComplexValue;
  maxLength?: number;
  onClick?: () => void;
}

/**
 * Component for displaying a complex value in a compact format
 * Used in blocks to show the current value
 */
export const ValueDisplay: React.FC<ValueDisplayProps> = ({
  value,
  maxLength = 50,
  onClick
}) => {
  const displayString = getValueDisplayString(value, maxLength);

  const getIcon = () => {
    switch (value.type) {
      case 'simple':
        return '📝';
      case 'array':
        return '📋';
      case 'object':
        return '📦';
    }
  };

  const getTypeLabel = () => {
    switch (value.type) {
      case 'simple':
        return 'Simple';
      case 'array':
        return `Array [${value.items.length}]`;
      case 'object':
        return `Object {${value.properties.length}}`;
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full group text-left transition-all duration-200"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 group-hover:bg-gray-100 transition-all">
        <span className="text-lg">{getIcon()}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 font-medium">{getTypeLabel()}</div>
          <div className="text-sm text-gray-900 font-mono truncate">{displayString}</div>
        </div>
        <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
          ✏️
        </span>
      </div>
    </button>
  );
};
