import React, { useState } from 'react';
import type { IfBlock as IfBlockType } from '../../types/blocks';
import { BlockRenderer } from './BlockRenderer';
import { IfBranchBody } from './common/IfBranchBody';
import { FalseHandlingButton } from './common/FalseHandlingButton';
import { IfEditModal } from '../modals/IfEditModal';

interface Props {
  block: IfBlockType;
  onUpdate?: (block: IfBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  onDelete?: (blockId: string) => void;
  availableVariables?: string[];
}

export const IfBlock: React.FC<Props> = ({
  block,
  onUpdate,
  onAddChild,
  onDelete,
  availableVariables = []
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const hasFalseHandling = block.elseType !== 'none';

  const handleSave = (data: { condition: string }) => {
    onUpdate?.({ ...block, ...data });
  };

  const addElseBlock = () => {
    onUpdate?.({ ...block, elseType: 'else', elseBody: [] });
  };

  const addElifBlock = () => {
    const newIfBlock: IfBlockType = {
      id: `if-${Date.now()}`,
      type: 'if',
      condition: 'True',
      ifBody: [],
      elseType: 'none',
      elseBody: []
    };
    onUpdate?.({ ...block, elseType: 'elif', elseBody: [newIfBlock] });
  };

  return (
    <div className="border-2 border-purple-500 rounded-lg bg-white shadow-lg mb-4 w-fit">
      {/* Header with condition */}
      <div className="p-3 bg-purple-50 border-b-2 border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-purple-700">⬥ If Statement</span>
          {onDelete && (
            <button
              onClick={() => onDelete(block.id)}
              className="text-red-500 hover:text-red-700 text-lg"
              title="Delete block"
            >
              🗑️
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Condition</span>
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 group text-left transition-all duration-200"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-50 group-hover:bg-purple-100 transition-all duration-200">
              <span className="text-purple-900 font-mono text-sm font-medium">
                {block.condition || <span className="text-gray-400 italic">Click to set condition</span>}
              </span>
              <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✏️</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main horizontal split - using table layout for true dynamic sizing */}
      <div className="table w-full border-collapse">
        <div className="table-row">
        {/* LEFT SIDE - True branch */}
        <div className="table-cell p-6 border-r-2 border-purple-300 bg-green-50/20 align-top min-w-[300px]">
          <div className="mb-4">
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded inline-block">
              ✓ TRUE
            </span>
          </div>

          <IfBranchBody
            title="TRUE"
            titleColor="text-green-600"
            titleBgColor="bg-green-100"
            children={block.ifBody}
            onUpdateChild={(childId, updated) => {
              const newIfBody = block.ifBody.map(c =>
                c.id === childId ? updated : c
              );
              onUpdate?.({ ...block, ifBody: newIfBody });
            }}
            onDeleteChild={(childId) => {
              const newIfBody = block.ifBody.filter(c => c.id !== childId);
              onUpdate?.({ ...block, ifBody: newIfBody });
            }}
            onAddChild={onAddChild}
            parentId={block.id}
            availableVariables={availableVariables}
            menuColor="purple"
          />
        </div>

        {/* RIGHT SIDE - False branch */}
        <div className={`table-cell ${hasFalseHandling ? 'p-6 w-1/2' : 'p-4 w-auto'} bg-red-50/20 align-top`}>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded inline-block">
                ✗ FALSE
              </span>
              {block.elseType === 'elif' && (
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded inline-block">
                  → ELIF
                </span>
              )}
              {block.elseType === 'else' && (
                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                  → ELSE
                </span>
              )}
            </div>
          </div>

          {!hasFalseHandling ? (
            <FalseHandlingButton
              onAddElse={addElseBlock}
              onAddElif={addElifBlock}
            />
          ) : (
            <IfBranchBody
              title="FALSE"
              titleColor="text-red-600"
              titleBgColor="bg-red-100"
              children={block.elseBody}
              onUpdateChild={(childId, updated) => {
                const newElseBody = block.elseBody.map(c =>
                  c.id === childId ? updated : c
                );
                onUpdate?.({ ...block, elseBody: newElseBody });
              }}
              onDeleteChild={(childId) => {
                const newElseBody = block.elseBody.filter(c => c.id !== childId);
                // If this was an elif block and we're deleting it, return to 'none' state
                if (block.elseType === 'elif' && newElseBody.length === 0) {
                  onUpdate?.({ ...block, elseType: 'none', elseBody: [] });
                } else {
                  onUpdate?.({ ...block, elseBody: newElseBody });
                }
              }}
              onAddChild={onAddChild}
              parentId={block.id + '-else'}
              availableVariables={availableVariables}
              menuColor="purple"
              showAddButton={block.elseType === 'else'}
            />
          )}
        </div>
        </div>
      </div>

      {/* Edit Modal */}
      <IfEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={block}
        mode="edit-field"
        field="condition"
        availableVariables={availableVariables}
      />
    </div>
  );
};