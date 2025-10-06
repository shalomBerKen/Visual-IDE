import React, { useState } from 'react';
import type { ReturnBlock as ReturnBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { EditableField } from '../common/EditableField';
import { ReturnEditModal } from '../modals/ReturnEditModal';

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
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (data: { value: string }) => {
    onUpdate?.({ ...block, ...data });
  };

  return (
    <>
      <BlockContainer color="red">
        <BlockHeader
          title="Return"
          color="red"
          pythonKeyword="return"
          onDelete={onDelete ? () => onDelete(block.id) : undefined}
        />

        <div className="space-y-3 pl-6">
          <EditableField
            label="Value"
            value={block.value}
            placeholder="Click to set return value"
            color="red"
            onClick={() => setModalOpen(true)}
          />
        </div>
      </BlockContainer>

      {/* Edit Modal */}
      <ReturnEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={block}
        mode="edit-field"
        field="value"
        availableVariables={availableVariables}
      />
    </>
  );
};
