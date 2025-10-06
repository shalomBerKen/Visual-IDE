import React from 'react';

interface AvailableVariablesListProps {
  variables: string[];
  onVariableClick: (variable: string) => void;
  title?: string;
}

/**
 * Displays a list of available variables as clickable buttons
 * Used in modals to help users insert variables
 */
export const AvailableVariablesList: React.FC<AvailableVariablesListProps> = ({
  variables,
  onVariableClick,
  title = 'Available Variables'
}) => {
  if (variables.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable}
            onClick={() => onVariableClick(variable)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
            type="button"
          >
            {variable}
          </button>
        ))}
      </div>
    </div>
  );
};
