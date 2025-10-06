import React, { useState } from 'react';
import type { FunctionCallBlock as FunctionCallBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { EditableField } from '../common/EditableField';
import { FunctionCallEditModal } from '../modals/FunctionCallEditModal';

interface FunctionCallBlockProps {
  block: FunctionCallBlockType;
  onUpdate: (block: FunctionCallBlockType) => void;
  onDelete: () => void;
  availableVariables?: string[];
  availableFunctions?: string[];
}

export const FunctionCallBlock: React.FC<FunctionCallBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  availableVariables = [],
  availableFunctions = []
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editField, setEditField] = useState<'functionName' | 'args' | undefined>();

  const handleFieldClick = (field: 'functionName' | 'args') => {
    setEditField(field);
    setModalOpen(true);
  };

  const handleSave = (data: { functionName: string; args: string[] }) => {
    onUpdate({ ...block, functionName: data.functionName, arguments: data.args });
  };

  return (
    <>
      <BlockContainer color="cyan">
        <BlockHeader
          title="Function Call"
          color="cyan"
          pythonKeyword="()"
          onDelete={onDelete}
        />

        <div className="space-y-3 pl-6">
          <EditableField
            label="Function"
            value={block.functionName}
            placeholder="Click to set function"
            color="cyan"
            onClick={() => handleFieldClick('functionName')}
          />

          <EditableField
            label="Args"
            value={block.arguments}
            placeholder="Click to add arguments"
            color="cyan"
            onClick={() => handleFieldClick('args')}
          />
        </div>
      </BlockContainer>

      {/* Edit Modal - field-specific only */}
      <FunctionCallEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={{ functionName: block.functionName, args: block.arguments }}
        mode="edit-field"
        field={editField}
        availableVariables={availableVariables}
        availableFunctions={availableFunctions}
      />
    </>
  );
};
