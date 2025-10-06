import React, { useState, useMemo } from 'react';
import type { FunctionBlock as FunctionBlockType } from '../../types/blocks';
import { getVariablesInFunction } from '../../utils/variableUtils';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockBody } from './common/BlockBody';
import { CollapsedSummary } from './common/CollapsedSummary';
import { EditableField } from '../common/EditableField';
import { FunctionEditModal } from '../modals/FunctionEditModal';

interface Props {
  block: FunctionBlockType;
  onUpdate?: (block: FunctionBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  onDelete?: () => void;
}

export const FunctionBlock: React.FC<Props> = ({
  block,
  onUpdate,
  onAddChild,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState<'name' | 'parameters' | undefined>();

  const availableVariables = useMemo(() => getVariablesInFunction(block), [block]);

  const handleFieldClick = (field: 'name' | 'parameters') => {
    setEditField(field);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<FunctionBlockType>) => {
    onUpdate?.({ ...block, ...data });
  };

  return (
    <BlockContainer color="blue" minWidth="[400px]">
      <BlockHeader
        title="Function"
        color="blue"
        pythonKeyword="def"
        onDelete={onDelete}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />

      {isExpanded && (
        <div className="space-y-3 pl-6">
          <EditableField
            label="Name"
            value={block.name}
            placeholder="Click to set name"
            color="blue"
            onClick={() => handleFieldClick('name')}
          />

          <EditableField
            label="Params"
            value={block.parameters}
            placeholder="Click to add parameters"
            color="blue"
            onClick={() => handleFieldClick('parameters')}
          />

          <BlockBody
            title="Function Body:"
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
            availableVariables={availableVariables}
            emptyMessage="Empty function body"
          />
        </div>
      )}

      {!isExpanded && (
        <CollapsedSummary summary={`${block.name}(${block.parameters.join(', ')})`} />
      )}

      {/* Edit Modal - field-specific only */}
      <FunctionEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={block}
        mode="edit-field"
        field={editField}
      />
    </BlockContainer>
  );
};
