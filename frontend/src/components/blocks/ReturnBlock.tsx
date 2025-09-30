import React from 'react';
import type { ReturnBlock as ReturnBlockType } from '../../types/blocks';
import { ValueInput } from '../common/ValueInput';

interface Props {
  block: ReturnBlockType;
  onUpdate?: (block: ReturnBlockType) => void;
  availableVariables?: string[];
}

export const ReturnBlock: React.FC<Props> = ({ block, onUpdate, availableVariables = [] }) => {
  return (
    <div className="border-2 border-red-500 rounded-lg p-4 bg-white shadow-lg mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-red-700">
            Return
          </span>
        </div>
        <div className="text-sm text-gray-500">return</div>
      </div>

      {/* Content */}
      <div className="space-y-3 pl-6">
        {/* Return Value */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 w-24">
            Value:
          </label>
          <ValueInput
            value={block.value}
            onChange={(value) => onUpdate?.({ ...block, value })}
            placeholder="return value"
            availableVariables={availableVariables}
            className="focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
};