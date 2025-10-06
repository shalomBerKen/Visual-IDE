import React from 'react';
import type { BlockColor } from './EditableField';

interface ModalActionsProps {
  onCancel: () => void;
  onSave: () => void;
  canSave: boolean;
  saveButtonText?: string;
  color?: BlockColor;
}

const colorClasses: Record<BlockColor, { enabled: string; disabled: string }> = {
  blue: {
    enabled: 'bg-blue-500 hover:bg-blue-600',
    disabled: 'bg-gray-300'
  },
  green: {
    enabled: 'bg-green-600 hover:bg-green-700',
    disabled: 'bg-gray-300'
  },
  purple: {
    enabled: 'bg-purple-500 hover:bg-purple-600',
    disabled: 'bg-gray-300'
  },
  orange: {
    enabled: 'bg-orange-500 hover:bg-orange-600',
    disabled: 'bg-gray-300'
  },
  red: {
    enabled: 'bg-red-500 hover:bg-red-600',
    disabled: 'bg-gray-300'
  },
  cyan: {
    enabled: 'bg-cyan-500 hover:bg-cyan-600',
    disabled: 'bg-gray-300'
  }
};

/**
 * Reusable modal action buttons (Cancel + Save/Create)
 * Used at the bottom of all edit modals
 */
export const ModalActions: React.FC<ModalActionsProps> = ({
  onCancel,
  onSave,
  canSave,
  saveButtonText = 'Save',
  color = 'blue'
}) => {
  const colors = colorClasses[color];

  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={!canSave}
        className={`px-4 py-2 rounded-md transition-colors text-white ${
          canSave ? colors.enabled : `${colors.disabled} cursor-not-allowed`
        }`}
      >
        {saveButtonText}
      </button>
    </div>
  );
};
