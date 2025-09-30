import React, { useState } from 'react';
import type { IfBlock as IfBlockType } from '../../types/blocks';
import { BlockRenderer } from './BlockRenderer';
import { ValueInput } from '../common/ValueInput';

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
  const [showIfMenu, setShowIfMenu] = useState(false);
  const [showElseMenu, setShowElseMenu] = useState(false);
  const [showFalseOptions, setShowFalseOptions] = useState(false);

  // Check if there's any false handling based on elseType
  const hasFalseHandling = block.elseType !== 'none';

  const addElseBlock = () => {
    // Set elseType to 'else' - allows any statements
    onUpdate?.({ ...block, elseType: 'else', elseBody: [] });
    setShowFalseOptions(false);
  };

  const addElifBlock = () => {
    // Set elseType to 'elif' and create an if block inside
    const newIfBlock: IfBlockType = {
      id: `if-${Date.now()}`,
      type: 'if',
      condition: 'True',
      ifBody: [],
      elseType: 'none',
      elseBody: []
    };

    onUpdate?.({ ...block, elseType: 'elif', elseBody: [newIfBlock] });
    setShowFalseOptions(false);
  };

  const renderAddMenu = (onAdd: (type: string) => void, onClose: () => void) => (
    <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-50 min-w-[150px]">
      <button
        onClick={() => { onAdd('variable'); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 border-b border-gray-200 text-sm"
      >
        🟢 Variable
      </button>
      <button
        onClick={() => { onAdd('if'); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700 border-b border-gray-200 text-sm"
      >
        🟣 If/Else
      </button>
      <button
        onClick={() => { onAdd('for'); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-orange-50 text-orange-700 border-b border-gray-200 text-sm"
      >
        🟠 For Loop
      </button>
      <button
        onClick={() => { onAdd('return'); onClose(); }}
        className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-700 text-sm"
      >
        🔴 Return
      </button>
    </div>
  );

  return (
    <div className="border-2 border-purple-500 rounded-lg bg-white shadow-lg mb-4 w-fit">
      {/* Header with condition */}
      <div className="p-3 bg-purple-50 border-b-2 border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-purple-700">⬥ Condition</span>
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
        <ValueInput
          value={block.condition}
          onChange={(condition) => onUpdate?.({ ...block, condition })}
          placeholder="condition (e.g., x > 0)"
          availableVariables={availableVariables}
          className="focus:ring-purple-500 text-sm"
        />
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

          {/* If body */}
          <div className="space-y-2 min-h-[120px]">
            {block.ifBody && block.ifBody.length > 0 ? (
              block.ifBody.map((child) => (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  onUpdate={(updated) => {
                    const newIfBody = block.ifBody.map(c =>
                      c.id === updated.id ? updated : c
                    );
                    onUpdate?.({ ...block, ifBody: newIfBody });
                  }}
                  onDelete={(childId) => {
                    const newIfBody = block.ifBody.filter(c => c.id !== childId);
                    onUpdate?.({ ...block, ifBody: newIfBody });
                  }}
                  onAddChild={onAddChild}
                  availableVariables={availableVariables}
                />
              ))
            ) : (
              <div className="text-gray-400 italic text-xs py-3 text-center border-2 border-dashed border-gray-300 rounded">
                Empty
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowIfMenu(!showIfMenu)}
                className="w-full py-2 px-3 border-2 border-dashed border-green-300 rounded-md text-green-600 hover:border-green-500 hover:bg-green-50 transition-colors text-xs font-medium"
              >
                + Add Statement
              </button>
              {showIfMenu && renderAddMenu(
                (type) => onAddChild?.(block.id, type),
                () => setShowIfMenu(false)
              )}
            </div>
          </div>
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
            /* Show button to add false handling */
            <div className="relative min-h-[80px] flex items-center justify-center">
              <button
                onClick={() => setShowFalseOptions(!showFalseOptions)}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-400 rounded-md text-gray-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm font-medium"
              >
                🔘 Add False Handling
              </button>

              {showFalseOptions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-purple-300 rounded-md shadow-lg z-50">
                  <button
                    onClick={addElifBlock}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 border-b border-gray-200"
                  >
                    <div className="font-semibold text-purple-700 text-sm">🟣 Add Condition (elif)</div>
                    <div className="text-xs text-gray-600 mt-0.5">Check another condition if this one is false</div>
                  </button>
                  <button
                    onClick={addElseBlock}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div className="font-semibold text-gray-700 text-sm">◼ Add Else</div>
                    <div className="text-xs text-gray-600 mt-0.5">Run code when condition is false</div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Show else body */
            <div className="space-y-2 min-h-[80px]">
              {block.elseBody.map((child) => (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  onUpdate={(updated) => {
                    const newElseBody = block.elseBody.map(c =>
                      c.id === updated.id ? updated : c
                    );
                    onUpdate?.({ ...block, elseBody: newElseBody });
                  }}
                  onDelete={(childId) => {
                    const newElseBody = block.elseBody.filter(c => c.id !== childId);
                    // If this was an elif block and we're deleting it, return to 'none' state
                    if (block.elseType === 'elif' && newElseBody.length === 0) {
                      onUpdate?.({ ...block, elseType: 'none', elseBody: [] });
                    } else {
                      onUpdate?.({ ...block, elseBody: newElseBody });
                    }
                  }}
                  onAddChild={onAddChild}
                  availableVariables={availableVariables}
                />
              ))}

              {/* Only show "Add Statement" button if elseType is 'else' (not 'elif') */}
              {block.elseType === 'else' && (
                <div className="relative">
                  <button
                    onClick={() => setShowElseMenu(!showElseMenu)}
                    className="w-full py-2 px-3 border-2 border-dashed border-red-300 rounded-md text-red-600 hover:border-red-500 hover:bg-red-50 transition-colors text-xs font-medium"
                  >
                    + Add Statement
                  </button>
                  {showElseMenu && renderAddMenu(
                    (type) => onAddChild?.(block.id + '-else', type),
                    () => setShowElseMenu(false)
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};