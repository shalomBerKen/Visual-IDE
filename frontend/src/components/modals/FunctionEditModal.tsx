import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { TagList } from '../common/TagList';
import { ModalActions } from '../common/ModalActions';
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
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setName(initialData.name || '');
      setParameters(initialData.parameters || []);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleAddParameter = (param: string) => {
    if (param.trim() && !parameters.includes(param.trim())) {
      setParameters([...parameters, param.trim()]);
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
          <ModalTextInput
            label="Function Name"
            value={name}
            onChange={setName}
            placeholder="e.g., calculate_total, process_data"
            hint="Use lowercase letters and underscores"
            color="blue"
            autoFocus
            required
          />
        )}

        {/* Parameters */}
        {(!field || field === 'parameters') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parameters
            </label>
            <TagList
              items={parameters}
              color="blue"
              onRemove={handleRemoveParameter}
              onAdd={handleAddParameter}
              addPlaceholder="Parameter name"
              addButtonText="Add"
            />
            <p className="mt-1 text-xs text-gray-500">
              Press Enter or click Add to add a parameter
            </p>
          </div>
        )}

        {/* Actions */}
        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          canSave={!!canSave}
          saveButtonText={mode === 'create' ? 'Create' : 'Save'}
          color="blue"
        />
      </div>
    </Modal>
  );
};
