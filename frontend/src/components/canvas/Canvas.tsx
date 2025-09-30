import React, { useState } from 'react';
import type {
  Block,
  FunctionBlock as FunctionBlockType,
  VariableBlock as VariableBlockType,
  IfBlock as IfBlockType,
  ForBlock as ForBlockType,
  ReturnBlock as ReturnBlockType
} from '../../types/blocks';
import { FunctionBlock } from '../blocks/FunctionBlock';
import { VariableBlock } from '../blocks/VariableBlock';
import { IfBlock } from '../blocks/IfBlock';
import { ForBlock } from '../blocks/ForBlock';
import { ReturnBlock } from '../blocks/ReturnBlock';
import { PythonLanguageService } from '../../core/languages/PythonLanguageService';
import { useBlockManager } from '../../hooks/useBlockManager';
import { useChildManager } from '../../hooks/useChildManager';

export const Canvas: React.FC = () => {
  const [showCode, setShowCode] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState('');
  const languageService = new PythonLanguageService();

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
  const addFunctionBlock = () => addBlock('function');
  const addVariableBlock = () => addBlock('variable');
  const addIfBlock = () => addBlock('if');
  const addForBlock = () => addBlock('for');
  const addReturnBlock = () => addBlock('return');

  // Wrapper for adding child blocks - uses the hook
  const addChildBlock = (parentId: string, blockType: string) => {
    const updatedBlocks = addChild(blocks, parentId, blockType);
    setBlocks(updatedBlocks);
  };

  const handleImportCode = () => {
    try {
      const parsedBlocks = languageService.parse(importCode);
      addBlocks(parsedBlocks);
      setImportCode('');
      setShowImport(false);
    } catch (error) {
      alert('Error parsing Python code. Please check your syntax.');
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

            {/* Import Button */}
            <div className="ml-auto">
              <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                <span>📥</span>
                <span>Import Python Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Import Code Section */}
        {showImport && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Paste Python Code
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
            blocks.map((block) => {
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
                    />
                  );
                case 'return':
                  return (
                    <ReturnBlock
                      key={block.id}
                      block={block as ReturnBlockType}
                      onUpdate={updateBlock}
                      onDelete={() => deleteBlock(block.id)}
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
              {showCode ? 'Hide Python Code' : 'Show Python Code'}
            </button>

            {showCode && (
              <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Generated Python Code:</span>
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
    </div>
  );
};