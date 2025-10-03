import React from 'react';
import type { VariableBlock as VariableBlockType } from '../../types/blocks';
import { ValueInput } from '../common/ValueInput';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockField } from './common/BlockField';

interface Props {
  block: VariableBlockType;
  onUpdate?: (block: VariableBlockType) => void;
  onDelete?: (blockId: string) => void;
  availableVariables?: string[];
}

export const VariableBlock: React.FC<Props> = ({
  block,
  onUpdate,
  onDelete,
  availableVariables = []
}) => {
  return (
    <BlockContainer color="green">
      <BlockHeader
        title="Variable"
        color="green"
        pythonKeyword="="
        onDelete={onDelete ? () => onDelete(block.id) : undefined}
      />

      <div className="space-y-3 pl-6">
        <BlockField label="Name:">
          <input
            type="text"
            value={block.name}
            onChange={(e) => onUpdate?.({ ...block, name: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="variable_name"
          />
        </BlockField>

        <BlockField label="Value:">
          <ValueInput
            value={block.value}
            onChange={(value) => onUpdate?.({ ...block, value })}
            placeholder="value"
            availableVariables={availableVariables}
          />
        </BlockField>
      </div>
    </BlockContainer>
  );
};
