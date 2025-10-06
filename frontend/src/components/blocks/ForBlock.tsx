import React, { useState } from 'react';
import type { ForBlock as ForBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockBody } from './common/BlockBody';
import { CollapsedSummary } from './common/CollapsedSummary';
import { EditableField } from '../common/EditableField';
import { ForEditModal } from '../modals/ForEditModal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState<'variable' | 'iterable' | undefined>();

  const handleFieldClick = (field: 'variable' | 'iterable') => {
    setEditField(field);
    setModalOpen(true);
  };

  const handleSave = (data: { variable: string; iterable: string }) => {
    onUpdate?.({ ...block, iterator: data.variable, iterable: data.iterable });
  };

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
          <EditableField
            label="Variable"
            value={block.iterator}
            placeholder="Click to set variable"
            color="orange"
            onClick={() => handleFieldClick('variable')}
          />

          <EditableField
            label="In"
            value={block.iterable}
            placeholder="Click to set iterable"
            color="orange"
            onClick={() => handleFieldClick('iterable')}
          />

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

      {/* Edit Modal - field-specific only */}
      <ForEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={{ variable: block.iterator, iterable: block.iterable }}
        mode="edit-field"
        field={editField}
        availableVariables={availableVariables}
      />
    </BlockContainer>
  );
};
