import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface ReturnEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { value: string }) => void;
  initialData?: { value?: string };
  mode: 'create' | 'edit-field';
  field?: 'value';
  availableVariables?: string[];
}

/**
 * Modal for creating/editing Return blocks
 */
export const ReturnEditModal: React.FC<ReturnEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  availableVariables = [],
  mode,
  field
}) => {
  const [value, setValue] = useState(initialData.value || '');
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setValue(initialData.value || '');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleSave = () => {
    onSave({ value });
    onClose();
  };

  const canSave = value.trim();

  const getTitle = () => {
    if (mode === 'create') return 'Create Return Statement';
    return 'Edit Return Value';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4">
        {/* Value input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Value
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="e.g., result, x + y, None"
            autoFocus
          />
          <p className="mt-1 text-sm text-gray-500">
            Value to return from the function
          </p>
        </div>

        {/* Available variables */}
        {availableVariables.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <button
                  key={variable}
                  onClick={() => setValue(value + variable)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`px-4 py-2 rounded-md transition-colors ${
              canSave
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
