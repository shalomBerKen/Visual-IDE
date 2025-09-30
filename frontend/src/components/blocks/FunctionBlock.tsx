import React, { useState, useMemo } from 'react';
import type { FunctionBlock as FunctionBlockType } from '../../types/blocks';
import { BlockRenderer } from './BlockRenderer';
import { getVariablesInFunction } from '../../utils/variableUtils';

interface Props {
  block: FunctionBlockType;
  onUpdate?: (block: FunctionBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  onDelete?: () => void;
}

export const FunctionBlock: React.FC<Props> = ({ block, onUpdate, onAddChild, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newParam, setNewParam] = useState('');

  // Get all available variables in this function
  const availableVariables = useMemo(() => getVariablesInFunction(block), [block]);

  return (
    <div className="border-2 border-blue-500 rounded-lg p-4 bg-white shadow-lg mb-4 min-w-[400px] w-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-bold text-xl"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className="text-lg font-semibold text-blue-700">
            Function
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">def</span>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600 font-bold text-lg px-2"
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
          {/* Function Name */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 w-24">
              Name:
            </label>
            <input
              type="text"
              value={block.name}
              onChange={(e) => onUpdate?.({ ...block, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="function_name"
            />
          </div>

          {/* Parameters */}
          <div className="flex items-start gap-2">
            <label className="text-sm font-medium text-gray-700 w-24 pt-2">
              Parameters:
            </label>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {block.parameters.map((param, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{param}</span>
                    <button
                      onClick={() => {
                        const newParams = block.parameters.filter((_, i) => i !== index);
                        onUpdate?.({ ...block, parameters: newParams });
                      }}
                      className="text-blue-900 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newParam}
                    onChange={(e) => setNewParam(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newParam.trim()) {
                        onUpdate?.({ ...block, parameters: [...block.parameters, newParam.trim()] });
                        setNewParam('');
                      }
                    }}
                    placeholder="param_name"
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (newParam.trim()) {
                        onUpdate?.({ ...block, parameters: [...block.parameters, newParam.trim()] });
                        setNewParam('');
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mt-4 border-t pt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Function Body:
            </div>
            <div className="ml-4 space-y-2 min-w-fit">
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
                    availableVariables={availableVariables}
                  />
                ))
              ) : (
                <div className="text-gray-400 italic text-sm py-3 text-center border-2 border-dashed border-gray-300 rounded">
                  Empty function body
                </div>
              )}

              {/* Add Statement Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  + Add Statement
                </button>

                {/* Add Menu Dropdown */}
                {showAddMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => {
                        onAddChild?.(block.id, 'variable');
                        setShowAddMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 border-b border-gray-200"
                    >
                      Variable
                    </button>
                    <button
                      onClick={() => {
                        onAddChild?.(block.id, 'if');
                        setShowAddMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700 border-b border-gray-200"
                    >
                      If/Else
                    </button>
                    <button
                      onClick={() => {
                        onAddChild?.(block.id, 'for');
                        setShowAddMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-orange-50 text-orange-700 border-b border-gray-200"
                    >
                      For Loop
                    </button>
                    <button
                      onClick={() => {
                        onAddChild?.(block.id, 'return');
                        setShowAddMenu(false);
                      }}
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
            {block.name}({block.parameters.join(', ')})
          </span>
        </div>
      )}
    </div>
  );
};