import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { FunctionBlock } from '../../types/blocks';

interface FunctionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<FunctionBlock>) => void;
  initialData?: Partial<FunctionBlock>;
  mode: 'create' | 'edit' | 'edit-field';
  field?: 'name' | 'parameters';
}

/**
 * Modal for creating/editing Function blocks
 */
export const FunctionEditModal: React.FC<FunctionEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  mode,
  field
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [parameters, setParameters] = useState<string[]>(initialData.parameters || []);
  const [newParam, setNewParam] = useState('');

  // Reset state when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setName(initialData.name || '');
      setParameters(initialData.parameters || []);
      setNewParam('');
    }
  }, [isOpen, initialData]);

  const handleAddParameter = () => {
    if (newParam.trim() && !parameters.includes(newParam.trim())) {
      setParameters([...parameters, newParam.trim()]);
      setNewParam('');
    }
  };

  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (mode === 'edit-field' && field) {
      if (field === 'name') {
        onSave({ name });
      } else if (field === 'parameters') {
        onSave({ parameters });
      }
    } else {
      onSave({ name, parameters });
    }
    onClose();
  };

  const canSave = mode === 'edit-field'
    ? (field === 'name' ? name.trim() : true)
    : name.trim();

  const getTitle = () => {
    if (mode === 'create') return 'Create Function';
    if (mode === 'edit-field') {
      return field === 'name' ? 'Edit Function Name' : 'Edit Parameters';
    }
    return 'Edit Function';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="md">
      <div className="space-y-4">
        {/* Function Name */}
        {(!field || field === 'name') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., calculate_total, process_data"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500">
              Use lowercase letters and underscores
            </p>
          </div>
        )}

        {/* Parameters */}
        {(!field || field === 'parameters') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parameters
            </label>

            {/* Parameter List */}
            {parameters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {parameters.map((param, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{param}</span>
                    <button
                      onClick={() => handleRemoveParameter(index)}
                      className="text-blue-900 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Parameter */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newParam}
                onChange={(e) => setNewParam(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParameter();
                  }
                }}
                placeholder="Parameter name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus={field === 'parameters'}
              />
              <button
                onClick={handleAddParameter}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Press Enter or click Add to add a parameter
            </p>
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
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
