import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ModalTextInput } from '../common/ModalTextInput';
import { ModalActions } from '../common/ModalActions';
import type { VariableBlock } from '../../types/blocks';
import type { ComplexValue } from '../../types/values';
import { ComplexValueDisplay } from '../valueBuilder';
import { migrateValue } from '../../utils/valueUtils';
import { createSimpleValue } from '../../types/values';

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
 * Now supports complex values (arrays and objects)
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

  // Migrate old string values to ComplexValue format
  const initialComplexValue = initialData.value
    ? migrateValue(initialData.value)
    : createSimpleValue('');

  const [value, setValue] = useState<ComplexValue>(initialComplexValue);
  const prevOpenRef = React.useRef(false);

  // Reset state only when modal transitions from closed to open
  React.useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setName(initialData.name || '');
      const newValue = initialData.value
        ? migrateValue(initialData.value)
        : createSimpleValue('');
      setValue(newValue);
    }
    prevOpenRef.current = isOpen;
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

  // For creation mode, use simple inputs
  const isCreateMode = mode === 'create';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size={isCreateMode ? 'md' : 'lg'}>
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
          isCreateMode ? (
            // Simple type selector for creation
            <SimpleValueTypeSelector value={value} onChange={setValue} />
          ) : (
            // Full value display for editing (with cascading panels)
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Value
              </label>
              <ComplexValueDisplay
                value={value}
                onChange={setValue}
                availableVariables={availableVariables}
              />
            </div>
          )
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

// Simple type selector for variable creation
const SimpleValueTypeSelector: React.FC<{
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
}> = ({ value, onChange }) => {
  const [selectedType, setSelectedType] = useState<'simple' | 'array' | 'object' | 'function-call'>(
    value.type === 'function-call' ? 'function-call' : value.type === 'simple' ? 'simple' : value.type
  );
  const [inputValue, setInputValue] = useState(
    value.type === 'simple' ? value.value : ''
  );
  const [functionName, setFunctionName] = useState(
    value.type === 'function-call' ? value.functionName : ''
  );

  const handleTypeChange = (type: 'simple' | 'array' | 'object' | 'function-call') => {
    setSelectedType(type);
    if (type === 'simple') {
      onChange(createSimpleValue(inputValue));
    } else if (type === 'array') {
      onChange({ type: 'array', items: [] });
    } else if (type === 'object') {
      onChange({ type: 'object', properties: [] });
    } else {
      onChange({ type: 'function-call', functionName, arguments: [] });
    }
  };

  const handleValueChange = (newValue: string) => {
    setInputValue(newValue);
    if (selectedType === 'simple') {
      onChange(createSimpleValue(newValue));
    }
  };

  const handleFunctionNameChange = (newName: string) => {
    setFunctionName(newName);
    if (selectedType === 'function-call') {
      onChange({ type: 'function-call', functionName: newName, arguments: [] });
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Value Type
      </label>

      {/* Type selector buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('simple')}
          className={`px-4 py-2 text-sm rounded transition-colors ${
            selectedType === 'simple'
              ? 'bg-green-100 text-green-800 border-2 border-green-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Value
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('array')}
          className={`px-4 py-2 text-sm rounded transition-colors ${
            selectedType === 'array'
              ? 'bg-green-100 text-green-800 border-2 border-green-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Array
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('object')}
          className={`px-4 py-2 text-sm rounded transition-colors ${
            selectedType === 'object'
              ? 'bg-green-100 text-green-800 border-2 border-green-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Object
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('function-call')}
          className={`px-4 py-2 text-sm rounded transition-colors ${
            selectedType === 'function-call'
              ? 'bg-green-100 text-green-800 border-2 border-green-500'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Function Call
        </button>
      </div>

      {/* Input for simple value */}
      {selectedType === 'simple' && (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter initial value (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
          />
          <p className="mt-1 text-xs text-gray-500">
            You can edit this value later on the block
          </p>
        </div>
      )}

      {/* Input for function name */}
      {selectedType === 'function-call' && (
        <div>
          <input
            type="text"
            value={functionName}
            onChange={(e) => handleFunctionNameChange(e.target.value)}
            placeholder="Enter function name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
          />
          <p className="mt-1 text-xs text-gray-500">
            Arguments can be added by clicking on the value on the block
          </p>
        </div>
      )}

      {/* Info for array/object */}
      {(selectedType === 'array' || selectedType === 'object') && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            {selectedType === 'array'
              ? 'An empty array will be created. You can add items by clicking on the value on the block.'
              : 'An empty object will be created. You can add properties by clicking on the value on the block.'}
          </p>
        </div>
      )}
    </div>
  );
};
