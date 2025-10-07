import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { AvailableVariablesList } from '../common/AvailableVariablesList';
import { ModalActions } from '../common/ModalActions';
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
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setName(initialData.name || '');
      setValue(initialData.value || '');
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

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
          <ModalTextInput
            label="Variable Name"
            value={name}
            onChange={setName}
            placeholder="e.g., count, total, username"
            hint="Use lowercase letters and underscores (e.g., my_variable)"
            color="green"
            autoFocus
            required
          />
        )}

        {/* Variable Value */}
        {(!field || field === 'value') && (
          <>
            <ModalTextInput
              label="Value"
              value={value}
              onChange={setValue}
              placeholder="e.g., 42, 'hello', True"
              hint="Numbers, strings (in quotes), booleans (True/False), or expressions"
              color="green"
              autoFocus={field === 'value'}
              required
            />

            {/* Available Variables - show when editing value */}
            {availableVariables.length > 0 && (
              <AvailableVariablesList
                variables={availableVariables}
                onVariableClick={(variable) => setValue(value + (value ? ' ' : '') + variable)}
              />
            )}
          </>
        )}

        {/* Actions */}
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          canSave={!!canSave}
          saveButtonText={mode === 'create' ? 'Create' : 'Save'}
          color="green"
        />
      </div>
    </Modal>
  );
};
