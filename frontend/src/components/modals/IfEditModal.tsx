import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface IfEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { condition: string }) => void;
  initialData?: { condition?: string };
  mode: 'create' | 'edit-field';
  field?: 'condition';
  availableVariables?: string[];
}

/**
 * Modal for creating/editing If blocks
 */
export const IfEditModal: React.FC<IfEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  availableVariables = [],
  mode,
  field
}) => {
  const [condition, setCondition] = useState(initialData.condition || '');
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setCondition(initialData.condition || '');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleSave = () => {
    onSave({ condition });
    onClose();
  };

  const canSave = condition.trim();

  const getTitle = () => {
    if (mode === 'create') return 'Create If Statement';
    if (field === 'condition') return 'Edit Condition';
    return 'Edit If Statement';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4">
        {/* Condition input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., x > 5"
            autoFocus
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a boolean expression (e.g., x &gt; 5, name == "test")
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
                  onClick={() => setCondition(condition + variable)}
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
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
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
