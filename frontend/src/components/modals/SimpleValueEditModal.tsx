import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ModalActions } from '../common/ModalActions';
import { ValueInput } from '../common/ValueInput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue: string;
  availableVariables?: string[];
}

export const SimpleValueEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialValue,
  availableVariables = []
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Value">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <ValueInput
            value={value}
            onChange={setValue}
            availableVariables={availableVariables}
            placeholder="Enter value..."
          />
        </div>

        <ModalActions
          onCancel={onClose}
          onSave={handleSave}
          saveLabel="Save"
        />
      </div>
    </Modal>
  );
};
