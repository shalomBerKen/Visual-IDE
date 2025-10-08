import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { ComplexValue } from '../../types/values';
import { createSimpleValue, createArrayValue, createObjectValue } from '../../types/values';

interface AddArrayItemProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (value: ComplexValue) => void;
}

export const AddArrayItemModal: React.FC<AddArrayItemProps> = ({ isOpen, onClose, onAdd }) => {
  const [selectedType, setSelectedType] = useState<'simple' | 'array' | 'object'>('simple');
  const [simpleValue, setSimpleValue] = useState('');

  const handleAdd = () => {
    let value: ComplexValue;

    if (selectedType === 'simple') {
      value = createSimpleValue(simpleValue);
    } else if (selectedType === 'array') {
      value = createArrayValue([]);
    } else {
      value = createObjectValue([]);
    }

    onAdd(value);
    setSimpleValue('');
    setSelectedType('simple');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Array Item"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('simple')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                selectedType === 'simple'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Value
            </button>
            <button
              onClick={() => setSelectedType('array')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                selectedType === 'array'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Array
            </button>
            <button
              onClick={() => setSelectedType('object')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                selectedType === 'object'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Object
            </button>
          </div>
        </div>

        {selectedType === 'simple' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              value={simpleValue}
              onChange={(e) => setSimpleValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        )}

        {selectedType !== 'simple' && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              An empty {selectedType} will be created. You can add items to it using the cascading panels.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface AddObjectPropertyProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (key: string, value: ComplexValue) => void;
}

export const AddObjectPropertyModal: React.FC<AddObjectPropertyProps> = ({ isOpen, onClose, onAdd }) => {
  const [propertyKey, setPropertyKey] = useState('');
  const [selectedType, setSelectedType] = useState<'simple' | 'array' | 'object'>('simple');
  const [simpleValue, setSimpleValue] = useState('');

  const handleAdd = () => {
    if (!propertyKey.trim()) {
      return;
    }

    let value: ComplexValue;

    if (selectedType === 'simple') {
      value = createSimpleValue(simpleValue);
    } else if (selectedType === 'array') {
      value = createArrayValue([]);
    } else {
      value = createObjectValue([]);
    }

    onAdd(propertyKey, value);
    setPropertyKey('');
    setSimpleValue('');
    setSelectedType('simple');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Object Property"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Key
          </label>
          <input
            type="text"
            value={propertyKey}
            onChange={(e) => setPropertyKey(e.target.value)}
            placeholder="Enter property key..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType('simple')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                selectedType === 'simple'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Value
            </button>
            <button
              onClick={() => setSelectedType('array')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                selectedType === 'array'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Array
            </button>
            <button
              onClick={() => setSelectedType('object')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                selectedType === 'object'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              Object
            </button>
          </div>
        </div>

        {selectedType === 'simple' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="text"
              value={simpleValue}
              onChange={(e) => setSimpleValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {selectedType !== 'simple' && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              An empty {selectedType} will be created. You can add items to it using the cascading panels.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!propertyKey.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Property
          </button>
        </div>
      </div>
    </Modal>
  );
};
