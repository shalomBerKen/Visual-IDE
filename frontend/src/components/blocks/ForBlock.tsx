import React, { useState } from 'react';
import type { ForBlock as ForBlockType } from '../../types/blocks';
import { BlockRenderer } from './BlockRenderer';
import { ValueInput } from '../common/ValueInput';

interface Props {
  block: ForBlockType;
  onUpdate?: (block: ForBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  onDelete?: (blockId: string) => void;
  availableVariables?: string[];
}

export const ForBlock: React.FC<Props> = ({ block, onUpdate, onAddChild, onDelete, availableVariables = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <div className="border-2 border-orange-500 rounded-lg p-4 bg-white shadow-lg mb-4 min-w-[400px] w-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-600 hover:text-orange-800 font-bold text-xl"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className="text-lg font-semibold text-orange-700">
            For Loop
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">for</span>
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
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-3 pl-6">
          {/* Iterator */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-24">
              Variable:
            </label>
            <input
              type="text"
              value={block.iterator}
              onChange={(e) => onUpdate?.({ ...block, iterator: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="item"
            />
          </div>

          {/* Iterable */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-24">
              In:
            </label>
            <ValueInput
              value={block.iterable}
              onChange={(iterable) => onUpdate?.({ ...block, iterable })}
              placeholder="range(10)"
              availableVariables={availableVariables}
              className="focus:ring-orange-500"
            />
          </div>

          {/* Loop Body */}
          <div className="mt-4 border-t pt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Loop Body:
            </div>
            <div className="ml-4 space-y-2 bg-orange-50 rounded p-3 min-w-fit">
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
                    onDelete={(childId) => {
                      const newChildren = block.children.filter(c => c.id !== childId);
                      onUpdate?.({ ...block, children: newChildren });
                    }}
                    onAddChild={onAddChild}
                    availableVariables={[...availableVariables, block.iterator]}
                  />
                ))
              ) : (
                <div className="text-gray-400 italic text-sm py-3 text-center border-2 border-dashed border-orange-300 rounded bg-white">
                  Empty loop body
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="w-full py-2 border-2 border-dashed border-orange-300 rounded-md text-orange-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                >
                  + Add Statement
                </button>
                {showAddMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => { onAddChild?.(block.id, 'variable'); setShowAddMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 border-b border-gray-200"
                    >
                      Variable
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id, 'if'); setShowAddMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700 border-b border-gray-200"
                    >
                      If/Else
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id, 'for'); setShowAddMenu(false); }}
                      className="w-full px-4 py-2 text-left hover:bg-orange-50 text-orange-700 border-b border-gray-200"
                    >
                      For Loop
                    </button>
                    <button
                      onClick={() => { onAddChild?.(block.id, 'return'); setShowAddMenu(false); }}
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
            for {block.iterator} in {block.iterable}
          </span>
        </div>
      )}
    </div>
  );
};