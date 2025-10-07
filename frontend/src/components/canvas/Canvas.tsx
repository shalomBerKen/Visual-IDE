import React, { useState } from 'react';
import type {
  Block,
  FunctionBlock as FunctionBlockType,
  VariableBlock as VariableBlockType,
  IfBlock as IfBlockType,
  ForBlock as ForBlockType,
  ReturnBlock as ReturnBlockType,
  FunctionCallBlock as FunctionCallBlockType
} from '../../types/blocks';
import { FunctionBlock } from '../blocks/FunctionBlock';
import { VariableBlock } from '../blocks/VariableBlock';
import { IfBlock } from '../blocks/IfBlock';
import { ForBlock } from '../blocks/ForBlock';
import { ReturnBlock } from '../blocks/ReturnBlock';
import { FunctionCallBlock } from '../blocks/FunctionCallBlock';
import { VariableEditModal } from '../modals/VariableEditModal';
import { FunctionEditModal } from '../modals/FunctionEditModal';
import { IfEditModal } from '../modals/IfEditModal';
import { ForEditModal } from '../modals/ForEditModal';
import { ReturnEditModal } from '../modals/ReturnEditModal';
import { FunctionCallEditModal } from '../modals/FunctionCallEditModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBlockManager } from '../../hooks/useBlockManager';
import { useChildManager } from '../../hooks/useChildManager';
import { getAvailableVariables } from '../../utils/variableUtils';

export const Canvas: React.FC = () => {
  const [showCode, setShowCode] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [createModalType, setCreateModalType] = useState<'variable' | 'function' | 'if' | 'for' | 'return' | 'functionCall' | null>(null);
  const [pendingParentId, setPendingParentId] = useState<string | null>(null);
  const { languageService, languageName } = useLanguage();

  // Use custom hooks for block management
  const {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
    addBlocks,
    createBlock,
    setBlocks
  } = useBlockManager();

  const { addChild } = useChildManager(createBlock);

  // Wrapper functions for adding specific block types
  const addFunctionBlock = () => setCreateModalType('function');
  const addVariableBlock = () => setCreateModalType('variable');
  const addIfBlock = () => setCreateModalType('if');
  const addForBlock = () => setCreateModalType('for');
  const addReturnBlock = () => setCreateModalType('return');
  const addFunctionCallBlock = () => setCreateModalType('functionCall');

  // Handle creating block from modal
  const handleCreateVariable = (data: Partial<VariableBlockType>) => {
    if (pendingParentId) {
      // Add as child with data
      const updatedBlocks = addChild(blocks, pendingParentId, 'variable', data);
      setBlocks(updatedBlocks);
      setPendingParentId(null);
    } else {
      // Add as top-level block
      const block = createBlock('variable') as VariableBlockType;
      const newBlock = { ...block, ...data };
      setBlocks([...blocks, newBlock]);
    }
    setCreateModalType(null);
  };

  const handleCreateFunction = (data: Partial<FunctionBlockType>) => {
    if (pendingParentId) {
      // Add as child with data
      const updatedBlocks = addChild(blocks, pendingParentId, 'function', data);
      setBlocks(updatedBlocks);
      setPendingParentId(null);
    } else {
      // Add as top-level block
      const block = createBlock('function') as FunctionBlockType;
      const newBlock = { ...block, ...data };
      setBlocks([...blocks, newBlock]);
    }
    setCreateModalType(null);
  };

  const handleCreateIf = (data: { condition: string }) => {
    if (pendingParentId) {
      const updatedBlocks = addChild(blocks, pendingParentId, 'if', data);
      setBlocks(updatedBlocks);
      setPendingParentId(null);
    } else {
      const block = createBlock('if') as IfBlockType;
      const newBlock = { ...block, ...data };
      setBlocks([...blocks, newBlock]);
    }
    setCreateModalType(null);
  };

  const handleCreateFor = (data: { variable: string; iterable: string }) => {
    const forData = { iterator: data.variable, iterable: data.iterable };
    if (pendingParentId) {
      const updatedBlocks = addChild(blocks, pendingParentId, 'for', forData);
      setBlocks(updatedBlocks);
      setPendingParentId(null);
    } else {
      const block = createBlock('for') as ForBlockType;
      const newBlock = { ...block, ...forData };
      setBlocks([...blocks, newBlock]);
    }
    setCreateModalType(null);
  };

  const handleCreateReturn = (data: { value: string }) => {
    if (pendingParentId) {
      const updatedBlocks = addChild(blocks, pendingParentId, 'return', data);
      setBlocks(updatedBlocks);
      setPendingParentId(null);
    } else {
      const block = createBlock('return') as ReturnBlockType;
      const newBlock = { ...block, ...data };
      setBlocks([...blocks, newBlock]);
    }
    setCreateModalType(null);
  };

  const handleCreateFunctionCall = (data: { functionName: string; args: string[] }) => {
    const callData = { functionName: data.functionName, arguments: data.args };
    if (pendingParentId) {
      const updatedBlocks = addChild(blocks, pendingParentId, 'functionCall', callData);
      setBlocks(updatedBlocks);
      setPendingParentId(null);
    } else {
      const block = createBlock('functionCall') as FunctionCallBlockType;
      const newBlock = { ...block, ...callData };
      setBlocks([...blocks, newBlock]);
    }
    setCreateModalType(null);
  };

  // Wrapper for adding child blocks - opens modal first
  const addChildBlock = (parentId: string, blockType: string) => {
    setPendingParentId(parentId);
    setCreateModalType(blockType as any);
  };

  // Calculate available variables based on current context
  const getModalAvailableVariables = (): string[] => {
    if (pendingParentId) {
      // If creating inside a parent, find that parent and get its variables
      const findParent = (blockList: Block[], parentId: string): FunctionBlockType | null => {
        for (const block of blockList) {
          if (block.id === parentId && block.type === 'function') {
            return block as FunctionBlockType;
          }
          if ('children' in block && block.children) {
            const found = findParent(block.children as Block[], parentId);
            if (found) return found;
          }
          if (block.type === 'if') {
            const ifBlock = block as IfBlockType;
            if (ifBlock.ifBody) {
              const found = findParent(ifBlock.ifBody, parentId);
              if (found) return found;
            }
            if (ifBlock.elseBody) {
              const found = findParent(ifBlock.elseBody, parentId);
              if (found) return found;
            }
          }
        }
        return null;
      };

      const parentFunction = findParent(blocks, pendingParentId);
      return getAvailableVariables(blocks, undefined, parentFunction || undefined);
    } else {
      // Creating at top level - get all variables defined so far
      return getAvailableVariables(blocks);
    }
  };

  const availableVars = getModalAvailableVariables();

  const handleImportCode = () => {
    try {
      const parsedBlocks = languageService.parse(importCode);
      addBlocks(parsedBlocks);
      setImportCode('');
      setShowImport(false);
    } catch (error) {
      alert(`Error parsing ${languageName} code. Please check your syntax.`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Visual IDE
          </h1>
          <p className="text-gray-600">
            Build Python code visually
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={addFunctionBlock}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Function</span>
            </button>
            <button
              onClick={addVariableBlock}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Variable</span>
            </button>
            <button
              onClick={addIfBlock}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>If/Else</span>
            </button>
            <button
              onClick={addForBlock}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Loop</span>
            </button>
            <button
              onClick={addReturnBlock}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Return</span>
            </button>
            <button
              onClick={addFunctionCallBlock}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Call Function</span>
            </button>

            {/* Import Button */}
            <div className="ml-auto">
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                <span>📥</span>
                <span>Import {languageName} Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Import Code Section */}
        {showImport && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Paste {languageName} Code
            </h3>
            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="def hello_world():&#10;    print('Hello, World!')&#10;    return True"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleImportCode}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportCode('');
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Canvas Area - with horizontal scroll */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <div className="space-y-4 min-w-fit">
          {blocks.length === 0 ? (
            <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="text-gray-400 text-lg mb-2">
                Your code canvas is empty
              </div>
              <div className="text-gray-500 text-sm">
                Click on the buttons above to add your first block
              </div>
            </div>
          ) : (
            blocks.map((block, index) => {
              // Calculate available variables for this block (all variables before it)
              const blockAvailableVars = getAvailableVariables(blocks.slice(0, index));

              switch (block.type) {
                case 'function':
                  return (
                    <FunctionBlock
                      key={block.id}
                      block={block as FunctionBlockType}
                      onUpdate={updateBlock}
                      onAddChild={addChildBlock}
                      onDelete={() => deleteBlock(block.id)}
                    />
                  );
                case 'variable':
                  return (
                    <VariableBlock
                      key={block.id}
                      block={block as VariableBlockType}
                      onUpdate={updateBlock}
                      onDelete={() => deleteBlock(block.id)}
                      availableVariables={blockAvailableVars}
                    />
                  );
                case 'if':
                  return (
                    <IfBlock
                      key={block.id}
                      block={block as IfBlockType}
                      onUpdate={updateBlock}
                      onAddChild={addChildBlock}
                      onDelete={() => deleteBlock(block.id)}
                      availableVariables={blockAvailableVars}
                    />
                  );
                case 'for':
                  return (
                    <ForBlock
                      key={block.id}
                      block={block as ForBlockType}
                      onUpdate={updateBlock}
                      onAddChild={addChildBlock}
                      onDelete={() => deleteBlock(block.id)}
                      availableVariables={blockAvailableVars}
                    />
                  );
                case 'return':
                  return (
                    <ReturnBlock
                      key={block.id}
                      block={block as ReturnBlockType}
                      onUpdate={updateBlock}
                      onDelete={() => deleteBlock(block.id)}
                      availableVariables={blockAvailableVars}
                    />
                  );
                case 'functionCall':
                  return (
                    <FunctionCallBlock
                      key={block.id}
                      block={block as FunctionCallBlockType}
                      onUpdate={updateBlock}
                      onDelete={() => deleteBlock(block.id)}
                      availableVariables={blockAvailableVars}
                    />
                  );
                default:
                  return null;
              }
            })
          )}
          </div>
        </div>

        {/* Code Export Section */}
        {blocks.length > 0 && (
          <div className="mt-6 space-y-4">
            <button
              onClick={() => setShowCode(!showCode)}
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              {showCode ? `Hide ${languageName} Code` : `Show ${languageName} Code`}
            </button>

            {showCode && (
              <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Generated {languageName} Code:</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(languageService.compile(blocks))}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs"
                  >
                    Copy
                  </button>
                </div>
                <pre className="whitespace-pre-wrap">
                  {languageService.compile(blocks)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modals */}
      <VariableEditModal
        isOpen={createModalType === 'variable'}
        onClose={() => setCreateModalType(null)}
        onSave={handleCreateVariable}
        availableVariables={availableVars}
        mode="create"
      />

      <FunctionEditModal
        isOpen={createModalType === 'function'}
        onClose={() => setCreateModalType(null)}
        onSave={handleCreateFunction}
        mode="create"
      />

      <IfEditModal
        isOpen={createModalType === 'if'}
        onClose={() => setCreateModalType(null)}
        onSave={handleCreateIf}
        availableVariables={availableVars}
        mode="create"
      />

      <ForEditModal
        isOpen={createModalType === 'for'}
        onClose={() => setCreateModalType(null)}
        onSave={handleCreateFor}
        availableVariables={availableVars}
        mode="create"
      />

      <ReturnEditModal
        isOpen={createModalType === 'return'}
        onClose={() => setCreateModalType(null)}
        onSave={handleCreateReturn}
        availableVariables={availableVars}
        mode="create"
      />

      <FunctionCallEditModal
        isOpen={createModalType === 'functionCall'}
        onClose={() => setCreateModalType(null)}
        onSave={handleCreateFunctionCall}
        availableVariables={availableVars}
        mode="create"
      />
    </div>
  );
};