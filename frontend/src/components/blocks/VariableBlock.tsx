import React, { useState } from 'react';
import type { VariableBlock as VariableBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
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
          {/* Name - Read-only with click to edit */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-14">Name</span>
            <button
              onClick={() => handleFieldClick('name')}
              className="flex-1 group text-left transition-all duration-200"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 group-hover:bg-green-100 transition-all duration-200">
                <span className="text-green-900 font-mono text-sm font-medium">
                  {block.name || <span className="text-gray-400 italic">Click to set name</span>}
                </span>
                <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
              </span>
            </button>
          </div>

          {/* Value - Read-only with click to edit */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-14">Value</span>
            <button
              onClick={() => handleFieldClick('value')}
              className="flex-1 group text-left transition-all duration-200"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 group-hover:bg-green-100 transition-all duration-200">
                <span className="text-green-900 font-mono text-sm font-medium">
                  {block.value || <span className="text-gray-400 italic">Click to set value</span>}
                </span>
                <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
              </span>
            </button>
          </div>
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
