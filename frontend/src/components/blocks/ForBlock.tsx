import React, { useState } from 'react';
import type { ForBlock as ForBlockType } from '../../types/blocks';
import { ValueInput } from '../common/ValueInput';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockField } from './common/BlockField';
import { BlockBody } from './common/BlockBody';
import { CollapsedSummary } from './common/CollapsedSummary';

interface Props {
  block: ForBlockType;
  onUpdate?: (block: ForBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  onDelete?: (blockId: string) => void;
  availableVariables?: string[];
}

export const ForBlock: React.FC<Props> = ({
  block,
  onUpdate,
  onAddChild,
  onDelete,
  availableVariables = []
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <BlockContainer color="orange" minWidth="[400px]">
      <BlockHeader
        title="For Loop"
        color="orange"
        pythonKeyword="for"
        onDelete={onDelete ? () => onDelete(block.id) : undefined}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />

      {isExpanded && (
        <div className="space-y-3 pl-6">
          <BlockField label="Variable:">
            <input
              type="text"
              value={block.iterator}
              onChange={(e) => onUpdate?.({ ...block, iterator: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="item"
            />
          </BlockField>

          <BlockField label="In:">
            <ValueInput
              value={block.iterable}
              onChange={(iterable) => onUpdate?.({ ...block, iterable })}
              placeholder="range(10)"
              availableVariables={availableVariables}
              className="focus:ring-orange-500"
            />
          </BlockField>

          <BlockBody
            title="Loop Body:"
            children={block.children}
            onUpdateChild={(childId, updated) => {
              const newChildren = block.children.map(c =>
                c.id === childId ? updated : c
              );
              onUpdate?.({ ...block, children: newChildren });
            }}
            onDeleteChild={(childId) => {
              const newChildren = block.children.filter(c => c.id !== childId);
              onUpdate?.({ ...block, children: newChildren });
            }}
            onAddChild={onAddChild}
            parentId={block.id}
            availableVariables={[...availableVariables, block.iterator]}
            emptyMessage="Empty loop body"
            backgroundColor="bg-orange-50"
            menuColor="orange"
          />
        </div>
      )}

      {!isExpanded && (
        <CollapsedSummary summary={`for ${block.iterator} in ${block.iterable}`} />
      )}
    </BlockContainer>
  );
};
