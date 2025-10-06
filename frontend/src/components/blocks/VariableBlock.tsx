import React, { useState } from 'react';
import type { VariableBlock as VariableBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { EditableField } from '../common/EditableField';
import { VariableEditModal } from '../modals/VariableEditModal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState<'name' | 'value' | undefined>();

  const handleFieldClick = (field: 'name' | 'value') => {
    setEditField(field);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<VariableBlockType>) => {
    onUpdate?.({ ...block, ...data });
  };

  return (
    <>
      <BlockContainer color="green">
        <BlockHeader
          title="Variable"
          color="green"
          pythonKeyword="="
          onDelete={onDelete ? () => onDelete(block.id) : undefined}
        />

        <div className="space-y-3 pl-6">
          <EditableField
            label="Name"
            value={block.name}
            placeholder="Click to set name"
            color="green"
            onClick={() => handleFieldClick('name')}
          />

          <EditableField
            label="Value"
            value={block.value}
            placeholder="Click to set value"
            color="green"
            onClick={() => handleFieldClick('value')}
          />
        </div>
      </BlockContainer>

      {/* Edit Modal - field-specific only */}
      <VariableEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={block}
        availableVariables={availableVariables}
        mode="edit-field"
        field={editField}
      />
    </>
  );
};
