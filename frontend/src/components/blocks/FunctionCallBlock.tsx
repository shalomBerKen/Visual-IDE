import React from 'react';
import type { FunctionCallBlock as FunctionCallBlockType } from '../../types/blocks';
import { ValueInput } from '../common/ValueInput';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockField } from './common/BlockField';
import { BlockFieldList } from './common/BlockFieldList';

interface FunctionCallBlockProps {
  block: FunctionCallBlockType;
  onUpdate: (block: FunctionCallBlockType) => void;
  onDelete: () => void;
}

export const FunctionCallBlock: React.FC<FunctionCallBlockProps> = ({
  block,
  onUpdate,
  onDelete
}) => {
  const handleNameChange = (name: string) => {
    onUpdate({ ...block, functionName: name });
  };

  const handleArgumentChange = (index: number, value: string) => {
    const newArgs = [...block.arguments];
    newArgs[index] = value;
    onUpdate({ ...block, arguments: newArgs });
  };

  const handleAddArgument = () => {
    onUpdate({ ...block, arguments: [...block.arguments, ''] });
  };

  const handleRemoveArgument = (index: number) => {
    const newArgs = block.arguments.filter((_, i) => i !== index);
    onUpdate({ ...block, arguments: newArgs });
  };

  return (
    <BlockContainer color="cyan">
      <BlockHeader
        title="Function Call"
        color="cyan"
        pythonKeyword="()"
        onDelete={onDelete}
      />

      <div className="space-y-3 pl-6">
        <BlockField label="Function:">
          <input
            type="text"
            value={block.functionName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="function_name"
          />
        </BlockField>

        <BlockFieldList
          label="Arguments:"
          items={block.arguments}
          onAdd={handleAddArgument}
          onRemove={handleRemoveArgument}
          addButtonText="+ Add Argument"
          addButtonColor="cyan"
          emptyText="No arguments"
          renderItem={(arg, index) => (
            <>
              <span className="text-xs text-gray-600 w-16">arg {index + 1}:</span>
              <ValueInput
                value={arg}
                onChange={(value) => handleArgumentChange(index, value)}
                placeholder={`argument ${index + 1}`}
                className="flex-1 focus:ring-cyan-500"
              />
            </>
          )}
        />
      </div>
    </BlockContainer>
  );
};
