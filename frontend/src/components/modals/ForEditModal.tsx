import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface ForEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { variable: string; iterable: string }) => void;
  initialData?: { variable?: string; iterable?: string };
  mode: 'create' | 'edit-field';
  field?: 'variable' | 'iterable';
  availableVariables?: string[];
}

/**
 * Modal for creating/editing For blocks
 */
export const ForEditModal: React.FC<ForEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  availableVariables = [],
  mode,
  field
}) => {
  const [variable, setVariable] = useState(initialData.variable || '');
  const [iterable, setIterable] = useState(initialData.iterable || '');
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setVariable(initialData.variable || '');
      setIterable(initialData.iterable || '');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleSave = () => {
    if (mode === 'edit-field' && field) {
      if (field === 'variable') {
        onSave({ variable, iterable: initialData.iterable || '' });
      } else if (field === 'iterable') {
        onSave({ variable: initialData.variable || '', iterable });
      }
    } else {
      onSave({ variable, iterable });
    }
    onClose();
  };

  const canSave = mode === 'edit-field'
    ? (field === 'variable' ? variable.trim() : iterable.trim())
    : (variable.trim() && iterable.trim());

  const getTitle = () => {
    if (mode === 'create') return 'Create For Loop';
    if (field === 'variable') return 'Edit Loop Variable';
    if (field === 'iterable') return 'Edit Iterable';
    return 'Edit For Loop';
  };

  const showVariableField = !field || field === 'variable';
  const showIterableField = !field || field === 'iterable';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4">
        {/* Variable input */}
        {showVariableField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loop Variable
            </label>
            <input
              type="text"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., i, item, x"
              autoFocus
            />
            <p className="mt-1 text-sm text-gray-500">
              Variable name to use in the loop
            </p>
          </div>
        )}

        {/* Iterable input */}
        {showIterableField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iterable
            </label>
            <input
              type="text"
              value={iterable}
              onChange={(e) => setIterable(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., range(10), my_list"
              autoFocus={field === 'iterable'}
            />
            <p className="mt-1 text-sm text-gray-500">
              Collection or range to iterate over
            </p>
          </div>
        )}

        {/* Available variables */}
        {availableVariables.length > 0 && showIterableField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((v) => (
                <button
                  key={v}
                  onClick={() => setIterable(iterable + v)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                >
                  {v}
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
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
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
