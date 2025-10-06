import React, { useState } from 'react';
import type { ReturnBlock as ReturnBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
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
          {/* Value - Read-only with click to edit */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-14">Value</span>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 group text-left transition-all duration-200"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 group-hover:bg-red-100 transition-all duration-200">
                <span className="text-red-900 font-mono text-sm font-medium">
                  {block.value || <span className="text-gray-400 italic">Click to set return value</span>}
                </span>
                <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
              </span>
            </button>
          </div>
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
