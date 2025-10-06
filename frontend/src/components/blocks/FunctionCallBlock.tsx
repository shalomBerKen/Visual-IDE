import React, { useState } from 'react';
import type { FunctionCallBlock as FunctionCallBlockType } from '../../types/blocks';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
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
          {/* Function Name - Read-only with click to edit */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-14">Function</span>
            <button
              onClick={() => handleFieldClick('functionName')}
              className="flex-1 group text-left transition-all duration-200"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-50 group-hover:bg-cyan-100 transition-all duration-200">
                <span className="text-cyan-900 font-mono text-sm font-medium">
                  {block.functionName || <span className="text-gray-400 italic">Click to set function</span>}
                </span>
                <span className="text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
              </span>
            </button>
          </div>

          {/* Arguments - Read-only with click to edit */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide w-14">Args</span>
            <button
              onClick={() => handleFieldClick('args')}
              className="flex-1 group text-left transition-all duration-200"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-50 group-hover:bg-cyan-100 transition-all duration-200">
                <span className="text-cyan-900 font-mono text-sm font-medium">
                  {block.arguments.length > 0 ? block.arguments.join(', ') : <span className="text-gray-400 italic">Click to add arguments</span>}
                </span>
                <span className="text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
              </span>
            </button>
          </div>
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
