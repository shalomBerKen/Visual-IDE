import React from 'react';
import type { BlockColor } from './EditableField';

interface ModalTextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  color?: BlockColor;
  autoFocus?: boolean;
  required?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const colorClasses: Record<BlockColor, string> = {
  blue: 'focus:ring-blue-500',
  green: 'focus:ring-green-500',
  purple: 'focus:ring-purple-500',
  orange: 'focus:ring-orange-500',
  red: 'focus:ring-red-500',
  cyan: 'focus:ring-cyan-500'
};

/**
 * Reusable text input field for modals
 * Includes label, input, and optional hint text
 */
export const ModalTextInput: React.FC<ModalTextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  hint,
  color = 'blue',
  autoFocus = false,
  required = false,
  onKeyDown
}) => {
  const focusRing = colorClasses[color];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${focusRing}`}
        autoFocus={autoFocus}
      />
      {hint && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
};
