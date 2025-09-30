import React, { useState } from 'react';
import type { IfBlock as IfBlockType } from '../../types/blocks';
import { BlockRenderer } from './BlockRenderer';
import { ValueInput } from '../common/ValueInput';

interface Props {
  block: IfBlockType;
  onUpdate?: (block: IfBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  availableVariables?: string[];
}

export const IfBlock: React.FC<Props> = ({ block, onUpdate, onAddChild, availableVariables = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showIfMenu, setShowIfMenu] = useState(false);
  const [showElseMenu, setShowElseMenu] = useState(false);

  return (
    <div className="border-2 border-purple-500 rounded-lg p-4 bg-white shadow-lg mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-800 font-bold text-xl"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className="text-lg font-semibold text-purple-700">
            If/Else
          </span>
        </div>
        <div className="text-sm text-gray-500">if</div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-3 pl-6">
          {/* Condition */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-24">
              Condition:
            </label>
            <ValueInput
              value={block.condition}
              onChange={(condition) => onUpdate?.({ ...block, condition })}
              placeholder="x > 0"
              availableVariables={availableVariables}
              className="focus:ring-purple-500"
            />
          </div>

          {/* If Body */}
          <div className="mt-4 border-t pt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              If True:
            </div>
            <div className="ml-4 space-y-2 bg-purple-50 rounded p-3">
              {block.children && block.children.length > 0 ? (
                block.children.map((child) => (
                  <BlockRenderer
                    key={child.id}
                    block={child}
                    onUpdate={(updated) => {
                      const newChildren = block.children.map(c =>
                        c.id === updated.id ? updated : c
                      );
                      onUpdate?.({ ...block, children: newChildren });
                    }}
                    onAddChild={onAddChild}
                    availableVariables={availableVariables}
                  />
                ))
              ) : (
                <div className="text-gray-400 italic text-sm">
                  Empty if body
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowIfMenu(!showIfMenu)}
                  className="w-full py-2 border-2 border-dashed border-purple-300 rounded-md text-purple-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  + Add Statement
                </button>
                {showIfMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { onAddChild?.(block.id, 'variable'); setShowIfMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 border-b border-gray-200"
                    >
                      Variable
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id, 'if'); setShowIfMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700 border-b border-gray-200"
                    >
                      If/Else
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id, 'for'); setShowIfMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-orange-50 text-orange-700 border-b border-gray-200"
                    >
                      For Loop
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id, 'return'); setShowIfMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-700"
                    >
                      Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Else Body */}
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Else:
            </div>
            <div className="ml-4 space-y-2 bg-gray-50 rounded p-3">
              {block.elseChildren && block.elseChildren.length > 0 ? (
                block.elseChildren.map((child) => (
                  <BlockRenderer
                    key={child.id}
                    block={child}
                    onUpdate={(updated) => {
                      const newElseChildren = (block.elseChildren || []).map(c =>
                        c.id === updated.id ? updated : c
                      );
                      onUpdate?.({ ...block, elseChildren: newElseChildren });
                    }}
                    onAddChild={onAddChild}
                    availableVariables={availableVariables}
                  />
                ))
              ) : (
                <div className="text-gray-400 italic text-sm">
                  Empty else body
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowElseMenu(!showElseMenu)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
                >
                  + Add Statement
                </button>
                {showElseMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { onAddChild?.(block.id + '-else', 'variable'); setShowElseMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 border-b border-gray-200"
                    >
                      Variable
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id + '-else', 'if'); setShowElseMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700 border-b border-gray-200"
                    >
                      If/Else
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id + '-else', 'for'); setShowElseMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-orange-50 text-orange-700 border-b border-gray-200"
                    >
                      For Loop
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id + '-else', 'return'); setShowElseMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-700"
                    >
                      Return
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Summary */}
      {!isExpanded && (
        <div className="pl-6 text-sm text-gray-600">
          <span className="font-mono">
            if {block.condition}
          </span>
        </div>
      )}
    </div>
  );
};