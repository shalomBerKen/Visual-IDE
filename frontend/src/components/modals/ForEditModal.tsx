import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { AvailableVariablesList } from '../common/AvailableVariablesList';
import { ModalActions } from '../common/ModalActions';

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
        {showVariableField && (
          <ModalTextInput
            label="Loop Variable"
            value={variable}
            onChange={setVariable}
            placeholder="e.g., i, item, x"
            hint="Variable name to use in the loop"
            color="orange"
            autoFocus
            required
          />
        )}

        {showIterableField && (
          <ModalTextInput
            label="Iterable"
            value={iterable}
            onChange={setIterable}
            placeholder="e.g., range(10), my_list"
            hint="Collection or range to iterate over"
            color="orange"
            autoFocus={field === 'iterable'}
            required
          />
        )}

        {availableVariables.length > 0 && showIterableField && (
          <AvailableVariablesList
            variables={availableVariables}
            onVariableClick={(v) => setIterable(iterable + v)}
          />
        )}

        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          canSave={!!canSave}
          saveButtonText={mode === 'create' ? 'Create' : 'Save'}
          color="orange"
        />
      </div>
    </Modal>
  );
};
