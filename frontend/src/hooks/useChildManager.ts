import { useCallback } from 'react';
import type { Block } from '../types/blocks';

/**
 * Hook for managing child blocks within parent blocks
 * Handles recursive addition of children to nested blocks
 */
export const useChildManager = (createBlock: (type: string) => Block | null) => {

  /**
   * Recursively adds a child block to a parent block
   * Supports special parentId syntax: 'blockId-else' for if/else blocks
   */
  const addChildToBlock = useCallback((
    block: Block,
    parentId: string,
    childBlock: Block
  ): Block => {
    // Direct match - add to function block
    if (block.id === parentId && block.type === 'function') {
      return {
        ...block,
        children: [...block.children, childBlock]
      };
    }

    // Direct match - add to if block's ifBody (TRUE branch)
    if (block.id === parentId && block.type === 'if') {
      return {
        ...block,
        ifBody: [...block.ifBody, childBlock]
      };
    }

    // Special case - add to if block's elseBody (FALSE branch)
    // parentId format: 'blockId-else'
    if (parentId === block.id + '-else' && block.type === 'if') {
      return {
        ...block,
        elseBody: [...block.elseBody, childBlock]
      };
    }

    // Direct match - add to for block
    if (block.id === parentId && block.type === 'for') {
      return {
        ...block,
        children: [...block.children, childBlock]
      };
    }

    // Recursively search in function children
    if (block.type === 'function') {
      return {
        ...block,
        children: block.children.map(child =>
          addChildToBlock(child, parentId, childBlock)
        )
      };
    }

    // Recursively search in if block's both branches
    if (block.type === 'if') {
      return {
        ...block,
        ifBody: block.ifBody.map(child =>
          addChildToBlock(child, parentId, childBlock)
        ),
        elseBody: block.elseBody.map(child =>
          addChildToBlock(child, parentId, childBlock)
        )
      };
    }

    // Recursively search in for block children
    if (block.type === 'for') {
      return {
        ...block,
        children: block.children.map(child =>
          addChildToBlock(child, parentId, childBlock)
        )
      };
    }

    // No match, return unchanged
    return block;
  }, []);

  /**
   * Main function to add a child block to a parent
   * Updates the blocks array with the new child
   */
  const addChild = useCallback((
    blocks: Block[],
    parentId: string,
    blockType: string,
    blockData?: Partial<Block>
  ): Block[] => {
    let newBlock = createBlock(blockType);
    if (!newBlock) return blocks;

    // Merge with provided data if any
    if (blockData) {
      newBlock = { ...newBlock, ...blockData };
    }

    return blocks.map(block => addChildToBlock(block, parentId, newBlock));
  }, [createBlock, addChildToBlock]);

  /**
   * Version that works with a setter function (for use with useState)
   */
  const addChildWithSetter = useCallback((
    setBlocks: (blocks: Block[]) => void,
    parentId: string,
    blockType: string
  ) => {
    const newBlock = createBlock(blockType);
    if (!newBlock) return;

    setBlocks((prevBlocks: Block[]) =>
      prevBlocks.map(block => addChildToBlock(block, parentId, newBlock))
    );
  }, [createBlock, addChildToBlock]);

  return {
    addChild,
    addChildToBlock, // Expose for more advanced use cases
    addChildWithSetter, // Expose for use with useState setter
  };
};