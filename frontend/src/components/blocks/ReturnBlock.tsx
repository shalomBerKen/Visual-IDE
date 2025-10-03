import React from 'react';
import type { ReturnBlock as ReturnBlockType } from '../../types/blocks';
import { ValueInput } from '../common/ValueInput';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockField } from './common/BlockField';

interface Props {
  block: ReturnBlockType;
  onUpdate?: (block: ReturnBlockType) => void;
  onDelete?: (blockId: string) => void;
  availableVariables?: string[];
}

export const ReturnBlock: React.FC<Props> = ({
  block,
  onUpdate,
  onDelete,
  availableVariables = []
}) => {
  return (
    <BlockContainer color="red">
      <BlockHeader
        title="Return"
        color="red"
        pythonKeyword="return"
        onDelete={onDelete ? () => onDelete(block.id) : undefined}
      />

      <div className="space-y-3 pl-6">
        <BlockField label="Value:">
          <ValueInput
            value={block.value}
            onChange={(value) => onUpdate?.({ ...block, value })}
            placeholder="return value"
            availableVariables={availableVariables}
            className="focus:ring-red-500"
          />
        </BlockField>
      </div>
    </BlockContainer>
  );
};
