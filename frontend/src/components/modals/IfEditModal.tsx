import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { AvailableVariablesList } from '../common/AvailableVariablesList';
import { ModalActions } from '../common/ModalActions';

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
        <ModalTextInput
          label="Condition"
          value={condition}
          onChange={setCondition}
          placeholder="e.g., x > 5"
          hint='Enter a boolean expression (e.g., x > 5, name == "test")'
          color="purple"
          autoFocus
          required
        />

        {availableVariables.length > 0 && (
          <AvailableVariablesList
            variables={availableVariables}
            onVariableClick={(variable) => setCondition(condition + variable)}
          />
        )}

        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          canSave={!!canSave}
          saveButtonText={mode === 'create' ? 'Create' : 'Save'}
          color="purple"
        />
      </div>
    </Modal>
  );
};
