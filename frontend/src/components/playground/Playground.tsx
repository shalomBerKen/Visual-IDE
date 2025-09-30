import React, { useState } from 'react';
import { FunctionBlock } from '../blocks/FunctionBlock';
import { VariableBlock } from '../blocks/VariableBlock';
import { IfBlock } from '../blocks/IfBlock';
import { ForBlock } from '../blocks/ForBlock';
import { ReturnBlock } from '../blocks/ReturnBlock';
import type { Block, FunctionBlock as FunctionBlockType, VariableBlock as VariableBlockType, IfBlock as IfBlockType, ForBlock as ForBlockType, ReturnBlock as ReturnBlockType } from '../../types/blocks';

type ComponentType = 'function' | 'variable' | 'if' | 'for' | 'return' | null;

export const Playground: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>(null);
  const [testBlock, setTestBlock] = useState<Block | null>(null);

  const createTestBlock = (type: ComponentType): Block | null => {
    const baseId = `test-${Date.now()}`;

    switch (type) {
      case 'function':
        return {
          id: baseId,
          type: 'function',
          name: 'example_function',
          parameters: ['param1', 'param2'],
          children: []
        } as FunctionBlockType;

      case 'variable':
        return {
          id: baseId,
          type: 'variable',
          name: 'my_variable',
          value: '42'
        } as VariableBlockType;

      case 'if':
        return {
          id: baseId,
          type: 'if',
          condition: 'x > 0',
          ifBody: [],
          elseType: 'none',
          elseBody: []
        } as IfBlockType;

      case 'for':
        return {
          id: baseId,
          type: 'for',
          iterator: 'i',
          iterable: 'range(10)',
          children: []
        } as ForBlockType;

      case 'return':
        return {
          id: baseId,
          type: 'return',
          value: 'result'
        } as ReturnBlockType;

      default:
        return null;
    }
  };

  const handleSelectComponent = (type: ComponentType) => {
    setSelectedComponent(type);
    setTestBlock(createTestBlock(type));
  };

  const handleAddChild = (parentId: string, child: Block) => {
    const addChildToBlock = (block: Block): Block => {
      if (block.id === parentId) {
        if (block.type === 'function') {
          return { ...block, children: [...block.children, child] };
        } else if (block.type === 'if') {
          return { ...block, ifBody: [...block.ifBody, child] };
        } else if (block.type === 'for') {
          return { ...block, children: [...block.children, child] };
        }
      }

      // Handle else body
      if (block.type === 'if' && parentId === block.id + '-else') {
        return { ...block, elseBody: [...block.elseBody, child] };
      }

      // Recursively search in children
      if (block.type === 'function') {
        return { ...block, children: block.children.map(addChildToBlock) };
      } else if (block.type === 'if') {
        return {
          ...block,
          ifBody: block.ifBody.map(addChildToBlock),
          elseBody: block.elseBody.map(addChildToBlock)
        };
      } else if (block.type === 'for') {
        return { ...block, children: block.children.map(addChildToBlock) };
      }

      return block;
    };

    if (testBlock) {
      setTestBlock(addChildToBlock(testBlock));
    }
  };

  const renderTestBlock = () => {
    if (!testBlock) return null;

    const availableVars = ['x', 'y', 'result', 'count', 'total'];

    switch (testBlock.type) {
      case 'function':
        return (
          <FunctionBlock
            block={testBlock as FunctionBlockType}
            onUpdate={(updated) => setTestBlock(updated)}
            onDelete={() => setTestBlock(null)}
            onAddChild={handleAddChild}
          />
        );

      case 'variable':
        return (
          <VariableBlock
            block={testBlock as VariableBlockType}
            onUpdate={(updated) => setTestBlock(updated)}
            availableVariables={availableVars}
            onDelete={() => setTestBlock(null)}
          />
        );

      case 'if':
        return (
          <IfBlock
            block={testBlock as IfBlockType}
            onUpdate={(updated) => setTestBlock(updated)}
            availableVariables={availableVars}
            onAddChild={handleAddChild}
            onDelete={() => setTestBlock(null)}
          />
        );

      case 'for':
        return (
          <ForBlock
            block={testBlock as ForBlockType}
            onUpdate={(updated) => setTestBlock(updated)}
            availableVariables={availableVars}
            onAddChild={handleAddChild}
            onDelete={() => setTestBlock(null)}
          />
        );

      case 'return':
        return (
          <ReturnBlock
            block={testBlock as ReturnBlockType}
            onUpdate={(updated) => setTestBlock(updated)}
            availableVariables={availableVars}
            onDelete={() => setTestBlock(null)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧪 Component Playground</h1>
          <p className="text-gray-600">
            Test and refine individual components before integrating them into the main IDE
          </p>
        </div>

        {/* Component Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Component to Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => handleSelectComponent('function')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedComponent === 'function'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-3xl mb-2">🔵</div>
              <div className="font-semibold text-sm">Function</div>
            </button>

            <button
              onClick={() => handleSelectComponent('variable')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedComponent === 'variable'
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="text-3xl mb-2">🟢</div>
              <div className="font-semibold text-sm">Variable</div>
            </button>

            <button
              onClick={() => handleSelectComponent('if')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedComponent === 'if'
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="text-3xl mb-2">🟣</div>
              <div className="font-semibold text-sm">If/Else</div>
            </button>

            <button
              onClick={() => handleSelectComponent('for')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedComponent === 'for'
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <div className="text-3xl mb-2">🟠</div>
              <div className="font-semibold text-sm">For Loop</div>
            </button>

            <button
              onClick={() => handleSelectComponent('return')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedComponent === 'return'
                  ? 'border-red-500 bg-red-50 shadow-md'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
              }`}
            >
              <div className="text-3xl mb-2">🔴</div>
              <div className="font-semibold text-sm">Return</div>
            </button>
          </div>
        </div>

        {/* Test Area */}
        {testBlock && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Testing: {selectedComponent} Block
              </h2>
              <button
                onClick={() => {
                  setTestBlock(null);
                  setSelectedComponent(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 overflow-x-auto">
              <div className="min-w-fit">
                {renderTestBlock()}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!testBlock && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">👆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Select a component to start testing
            </h3>
            <p className="text-gray-600">
              Choose a block type above to test its appearance and functionality
            </p>
          </div>
        )}
      </div>
    </div>
  );
};