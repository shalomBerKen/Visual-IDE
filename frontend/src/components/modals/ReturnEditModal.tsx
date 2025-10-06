import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { AvailableVariablesList } from '../common/AvailableVariablesList';
import { ModalActions } from '../common/ModalActions';

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
        <ModalTextInput
          label="Return Value"
          value={value}
          onChange={setValue}
          placeholder="e.g., result, x + y, None"
          hint="Value to return from the function"
          color="red"
          autoFocus
          required
        />

        {availableVariables.length > 0 && (
          <AvailableVariablesList
            variables={availableVariables}
            onVariableClick={(variable) => setValue(value + variable)}
          />
        )}

        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          canSave={!!canSave}
          saveButtonText={mode === 'create' ? 'Create' : 'Save'}
          color="red"
        />
      </div>
    </Modal>
  );
};
