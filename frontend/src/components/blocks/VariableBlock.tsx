import React from 'react';
import type { VariableBlock as VariableBlockType } from '../../types/blocks';
import { ValueInput } from '../common/ValueInput';

interface Props {
  block: VariableBlockType;
  onUpdate?: (block: VariableBlockType) => void;
  onDelete?: (blockId: string) => void;
  availableVariables?: string[];
}

export const VariableBlock: React.FC<Props> = ({ block, onUpdate, onDelete, availableVariables = [] }) => {
  return (
    <div className="border-2 border-green-500 rounded-lg p-4 bg-white shadow-lg mb-4 min-w-[350px] w-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-green-700">
            Variable
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">=</span>
          {onDelete && (
            <button
              onClick={() => onDelete(block.id)}
              className="text-red-500 hover:text-red-700 text-lg"
              title="Delete block"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 pl-6">
        {/* Variable Name */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 w-24">
            Name:
          </label>
          <input
            type="text"
            value={block.name}
            onChange={(e) => onUpdate?.({ ...block, name: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="variable_name"
          />
        </div>

        {/* Variable Value */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 w-24">
            Value:
          </label>
          <ValueInput
            value={block.value}
            onChange={(value) => onUpdate?.({ ...block, value })}
            placeholder="value"
            availableVariables={availableVariables}
          />
        </div>
      </div>
    </div>
  );
};