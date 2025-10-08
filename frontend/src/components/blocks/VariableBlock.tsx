import React, { useState } from 'react';
import type { VariableBlock as VariableBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { EditableField } from '../common/EditableField';
import { VariableEditModal } from '../modals/VariableEditModal';
import { ComplexValueDisplay } from '../valueBuilder/ComplexValueDisplay';
import { migrateValue } from '../../utils/valueUtils';
import type { ComplexValue } from '../../types/values';

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

  const handleFieldClick = (field: 'name') => {
    setEditField(field);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<VariableBlockType>) => {
    onUpdate?.({ ...block, ...data });
  };

  const handleValueChange = (newValue: ComplexValue) => {
    onUpdate?.({ ...block, value: newValue });
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

          {/* Value - always show ComplexValueDisplay */}
          <div className="flex items-start gap-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-14 mt-2">
              Value
            </span>
            <div className="flex-1">
              <ComplexValueDisplay
                value={migrateValue(block.value)}
                onChange={handleValueChange}
              />
            </div>
          </div>
        </div>
      </BlockContainer>

      {/* Edit Modal - for name only */}
      {editField === 'name' && (
        <VariableEditModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={block}
          availableVariables={availableVariables}
          mode="edit-field"
          field={editField}
        />
      )}
    </>
  );
};
