import React, { useState, useMemo } from 'react';
import type { FunctionBlock as FunctionBlockType } from '../../types/blocks';
import { getVariablesInFunction } from '../../utils/variableUtils';
import { BlockContainer } from './common/BlockContainer';
import { BlockHeader } from './common/BlockHeader';
import { BlockField } from './common/BlockField';
import { BlockBody } from './common/BlockBody';
import { CollapsedSummary } from './common/CollapsedSummary';

interface Props {
  block: FunctionBlockType;
  onUpdate?: (block: FunctionBlockType) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  onDelete?: () => void;
}

export const FunctionBlock: React.FC<Props> = ({
  block,
  onUpdate,
  onAddChild,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newParam, setNewParam] = useState('');

  const availableVariables = useMemo(() => getVariablesInFunction(block), [block]);

  return (
    <BlockContainer color="blue" minWidth="[400px]">
      <BlockHeader
        title="Function"
        color="blue"
        pythonKeyword="def"
        onDelete={onDelete}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />

      {isExpanded && (
        <div className="space-y-3 pl-6">
          <BlockField label="Name:">
            <input
              type="text"
              value={block.name}
              onChange={(e) => onUpdate?.({ ...block, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="function_name"
            />
          </BlockField>

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

          <BlockBody
            title="Function Body:"
            children={block.children}
            onUpdateChild={(childId, updated) => {
              const newChildren = block.children.map(c =>
                c.id === childId ? updated : c
              );
              onUpdate?.({ ...block, children: newChildren });
            }}
            onDeleteChild={(childId) => {
              const newChildren = block.children.filter(c => c.id !== childId);
              onUpdate?.({ ...block, children: newChildren });
            }}
            onAddChild={onAddChild}
            parentId={block.id}
            availableVariables={availableVariables}
            emptyMessage="Empty function body"
          />
        </div>
      )}

      {!isExpanded && (
        <CollapsedSummary summary={`${block.name}(${block.parameters.join(', ')})`} />
      )}
    </BlockContainer>
  );
};
