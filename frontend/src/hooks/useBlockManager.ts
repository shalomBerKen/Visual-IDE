import { useState, useCallback } from 'react';
import type { Block } from '../types/blocks';
import { BlockFactory } from '../services/BlockFactory';

/**
 * Hook for managing a list of blocks
 * Provides add, update, delete operations
 */
export const useBlockManager = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Create a new block with default values based on type
  // Delegates to BlockFactory for consistency
  const createBlock = useCallback((type: string, customId?: string): Block | null => {
    return BlockFactory.createBlock(type, customId);
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