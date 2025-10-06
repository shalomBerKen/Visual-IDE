import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface FunctionCallEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { functionName: string; args: string[] }) => void;
  initialData?: { functionName?: string; args?: string[] };
  mode: 'create' | 'edit-field';
  field?: 'functionName' | 'args';
  availableVariables?: string[];
  availableFunctions?: string[];
}

/**
 * Modal for creating/editing FunctionCall blocks
 */
export const FunctionCallEditModal: React.FC<FunctionCallEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  availableVariables = [],
  availableFunctions = [],
  mode,
  field
}) => {
  const [functionName, setFunctionName] = useState(initialData.functionName || '');
  const [args, setArgs] = useState<string[]>(initialData.args || []);
  const [newArg, setNewArg] = useState('');
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setFunctionName(initialData.functionName || '');
      setArgs(initialData.args || []);
      setNewArg('');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleAddArg = () => {
    if (newArg.trim()) {
      setArgs([...args, newArg.trim()]);
      setNewArg('');
    }
  };

  const handleRemoveArg = (index: number) => {
    setArgs(args.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (mode === 'edit-field' && field) {
      if (field === 'functionName') {
        onSave({ functionName, args: initialData.args || [] });
      } else if (field === 'args') {
        onSave({ functionName: initialData.functionName || '', args });
      }
    } else {
      onSave({ functionName, args });
    }
    onClose();
  };

  const canSave = mode === 'edit-field'
    ? (field === 'functionName' ? functionName.trim() : true)
    : functionName.trim();

  const getTitle = () => {
    if (mode === 'create') return 'Create Function Call';
    if (field === 'functionName') return 'Edit Function Name';
    if (field === 'args') return 'Edit Arguments';
    return 'Edit Function Call';
  };

  const showFunctionNameField = !field || field === 'functionName';
  const showArgsField = !field || field === 'args';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <div className="space-y-4">
        {/* Function Name */}
        {showFunctionNameField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Name
            </label>
            <input
              type="text"
              value={functionName}
              onChange={(e) => setFunctionName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., print, my_function"
              autoFocus
            />
            {availableFunctions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Available functions:</p>
                <div className="flex flex-wrap gap-2">
                  {availableFunctions.map((func) => (
                    <button
                      key={func}
                      onClick={() => setFunctionName(func)}
                      className="px-2 py-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded text-sm transition-colors"
                    >
                      {func}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Arguments */}
        {showArgsField && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arguments
            </label>
            <div className="space-y-2">
              {args.map((arg, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded text-sm">
                    {arg}
                  </span>
                  <button
                    onClick={() => handleRemoveArg(index)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newArg}
                  onChange={(e) => setNewArg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddArg();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Add argument..."
                />
                <button
                  onClick={handleAddArg}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Available variables */}
            {availableVariables.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Available variables:</p>
                <div className="flex flex-wrap gap-2">
                  {availableVariables.map((variable) => (
                    <button
                      key={variable}
                      onClick={() => setNewArg(newArg + variable)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
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
