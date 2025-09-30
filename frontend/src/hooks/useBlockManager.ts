import { useState, useCallback } from 'react';
import type {
  Block,
  FunctionBlock,
  VariableBlock,
  IfBlock,
  ForBlock,
  ReturnBlock
} from '../types/blocks';

/**
 * Hook for managing a list of blocks
 * Provides add, update, delete operations
 */
export const useBlockManager = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Create a new block with default values based on type
  const createBlock = useCallback((type: string, customId?: string): Block | null => {
    const id = customId || `${type}-${Date.now()}`;

    switch (type) {
      case 'function':
        return {
          id,
          type: 'function',
          name: 'new_function',
          parameters: [],
          children: [],
        } as FunctionBlock;

      case 'variable':
        return {
          id,
          type: 'variable',
          name: 'new_var',
          value: '0',
        } as VariableBlock;

      case 'if':
        return {
          id,
          type: 'if',
          condition: 'True',
          ifBody: [],
          elseType: 'none',
          elseBody: [],
        } as IfBlock;

      case 'for':
        return {
          id,
          type: 'for',
          iterator: 'i',
          iterable: 'range(10)',
          children: [],
        } as ForBlock;

      case 'return':
        return {
          id,
          type: 'return',
          value: 'None',
        } as ReturnBlock;

      default:
        return null;
    }
  }, []);

  // Add a new top-level block
  const addBlock = useCallback((type: string) => {
    const newBlock = createBlock(type);
    if (newBlock) {
      setBlocks(prev => [...prev, newBlock]);
    }
  }, [createBlock]);

  // Update an existing block
  const updateBlock = useCallback((updatedBlock: Block) => {
    setBlocks(prev => prev.map(block =>
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  }, []);

  // Delete a block by ID
  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  }, []);

  // Set blocks directly (useful for import)
  const setBlocksDirectly = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
  }, []);

  // Add blocks to existing list (useful for import)
  const addBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(prev => [...prev, ...newBlocks]);
  }, []);

  // Clear all blocks
  const clearBlocks = useCallback(() => {
    setBlocks([]);
  }, []);

  return {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
    setBlocks: setBlocksDirectly,
    addBlocks,
    clearBlocks,
    createBlock, // Expose for child operations
  };
};