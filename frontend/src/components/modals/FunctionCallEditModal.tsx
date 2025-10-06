import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { TagList } from '../common/TagList';
import { AvailableVariablesList } from '../common/AvailableVariablesList';
import { ModalActions } from '../common/ModalActions';

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
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setFunctionName(initialData.functionName || '');
      setArgs(initialData.args || []);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleAddArg = (arg: string) => {
    if (arg.trim()) {
      setArgs([...args, arg.trim()]);
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
        {showFunctionNameField && (
          <div className="space-y-2">
            <ModalTextInput
              label="Function Name"
              value={functionName}
              onChange={setFunctionName}
              placeholder="e.g., print, my_function"
              color="cyan"
              autoFocus
              required
            />
            {availableFunctions.length > 0 && (
              <AvailableVariablesList
                variables={availableFunctions}
                onVariableClick={setFunctionName}
                title="Available Functions"
              />
            )}
          </div>
        )}

        {showArgsField && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arguments
            </label>
            <TagList
              items={args}
              color="cyan"
              onRemove={handleRemoveArg}
              onAdd={handleAddArg}
              addPlaceholder="Add argument..."
              addButtonText="Add"
            />
            {availableVariables.length > 0 && (
              <AvailableVariablesList
                variables={availableVariables}
                onVariableClick={(variable) => handleAddArg(variable)}
              />
            )}
          </div>
        )}

        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          canSave={!!canSave}
          saveButtonText={mode === 'create' ? 'Create' : 'Save'}
          color="cyan"
        />
      </div>
    </Modal>
  );
};
