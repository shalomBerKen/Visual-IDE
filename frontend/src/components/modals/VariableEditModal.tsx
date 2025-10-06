import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { VariableBlock } from '../../types/blocks';

interface VariableEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<VariableBlock>) => void;
  initialData?: Partial<VariableBlock>;
  availableVariables?: string[];
  mode: 'create' | 'edit' | 'edit-field';
  field?: 'name' | 'value';
}

/**
 * Modal for creating/editing Variable blocks
 */
export const VariableEditModal: React.FC<VariableEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  availableVariables = [],
  mode,
  field
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [value, setValue] = useState(initialData.value || '');

  // Reset state when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setName(initialData.name || '');
      setValue(initialData.value || '');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (mode === 'edit-field' && field) {
      // Only save the specific field
      if (field === 'name') {
        onSave({ name });
      } else if (field === 'value') {
        onSave({ value });
      }
    } else {
      // Save all fields
      onSave({ name, value });
    }
    onClose();
  };

  const canSave = mode === 'edit-field'
    ? (field === 'name' ? name.trim() : true)
    : name.trim();

  const getTitle = () => {
    if (mode === 'create') return 'Create Variable';
    if (mode === 'edit-field') {
      return field === 'name' ? 'Edit Variable Name' : 'Edit Variable Value';
    }
    return 'Edit Variable';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="md">
      <div className="space-y-4">
        {/* Variable Name */}
        {(!field || field === 'name') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variable Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., count, total, username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Use lowercase letters and underscores (e.g., my_variable)
            </p>
          </div>
        )}

        {/* Variable Value */}
        {(!field || field === 'value') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value *
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., 42, 'hello', True"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus={field === 'value'}
            />
            <p className="mt-1 text-xs text-gray-500">
              Numbers, strings (in quotes), booleans (True/False), or expressions
            </p>
          </div>
        )}

        {/* Available Variables (only in full edit mode) */}
        {!field && availableVariables.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <button
                  key={variable}
                  onClick={() => setValue(value + (value ? ' + ' : '') + variable)}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
