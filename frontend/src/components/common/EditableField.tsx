import React from 'react';

export type BlockColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';

interface EditableFieldProps {
  label: string;
  value: string | string[] | null | undefined;
  placeholder: string;
  color: BlockColor;
  onClick: () => void;
  labelWidth?: string;
}

const colorClasses: Record<BlockColor, { bg: string; bgHover: string; text: string; icon: string }> = {
  blue: {
    bg: 'bg-blue-50',
    bgHover: 'group-hover:bg-blue-100',
    text: 'text-blue-900',
    icon: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    bgHover: 'group-hover:bg-green-100',
    text: 'text-green-900',
    icon: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    bgHover: 'group-hover:bg-purple-100',
    text: 'text-purple-900',
    icon: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-50',
    bgHover: 'group-hover:bg-orange-100',
    text: 'text-orange-900',
    icon: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    bgHover: 'group-hover:bg-red-100',
    text: 'text-red-900',
    icon: 'text-red-600'
  },
  cyan: {
    bg: 'bg-cyan-50',
    bgHover: 'group-hover:bg-cyan-100',
    text: 'text-cyan-900',
    icon: 'text-cyan-600'
  }
};

/**
 * Reusable component for displaying an editable field in blocks
 * Shows a read-only pill-style field that opens a modal on click
 */
export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  placeholder,
  color,
  onClick,
  labelWidth = 'w-14'
}) => {
  const colors = colorClasses[color];

  // Format value for display
  const displayValue = Array.isArray(value)
    ? value.join(', ')
    : value;

  const hasValue = displayValue && displayValue.trim();

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-semibold text-gray-600 uppercase tracking-wide ${labelWidth}`}>
        {label}
      </span>
      <button
        onClick={onClick}
        className="flex-1 group text-left transition-all duration-200"
      >
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${colors.bg} ${colors.bgHover} transition-all duration-200`}>
          <span className={`${colors.text} font-mono text-sm font-medium`}>
            {hasValue ? (
              displayValue
            ) : (
              <span className="text-gray-400 italic">{placeholder}</span>
            )}
          </span>
          <span className={`${colors.icon} opacity-0 group-hover:opacity-100 transition-opacity text-xs`}>
            ✏️
          </span>
        </span>
      </button>
    </div>
  );
};
