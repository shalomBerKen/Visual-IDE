import React from 'react';

interface BlockHeaderProps {
  title: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  pythonKeyword?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

const colorClasses = {
  blue: {
    text: 'text-blue-700',
    button: 'text-blue-600 hover:text-blue-800',
  },
  green: {
    text: 'text-green-700',
    button: 'text-green-600 hover:text-green-800',
  },
  purple: {
    text: 'text-purple-700',
    button: 'text-purple-600 hover:text-purple-800',
  },
  orange: {
    text: 'text-orange-700',
    button: 'text-orange-600 hover:text-orange-800',
  },
  red: {
    text: 'text-red-700',
    button: 'text-red-600 hover:text-red-800',
  },
  cyan: {
    text: 'text-cyan-700',
    button: 'text-cyan-600 hover:text-cyan-800',
  },
};

/**
 * Unified header for all block types
 * Includes title, expand/collapse button, Python keyword, and delete button
 */
export const BlockHeader: React.FC<BlockHeaderProps> = ({
  title,
  color,
  pythonKeyword,
  onDelete,
  onEdit,
  onToggleExpand,
  isExpanded,
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {onToggleExpand !== undefined && (
          <button
            onClick={onToggleExpand}
            className={`${colorClasses[color].button} font-bold text-xl`}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        <span className={`text-lg font-semibold ${colorClasses[color].text}`}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {pythonKeyword && (
          <span className="text-sm text-gray-500">{pythonKeyword}</span>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className={`${colorClasses[color].button} text-sm font-medium`}
            title="Edit all properties"
          >
            ✎ Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 text-lg"
            title="Delete block"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};
