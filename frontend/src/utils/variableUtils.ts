import type { Block, FunctionBlock } from '../types/blocks';

/**
 * Collects all available variables in the current scope
 * This includes function parameters and variables declared before the current position
 */
export function getAvailableVariables(
  blocks: Block[],
  currentBlockId?: string,
  parentFunction?: FunctionBlock
): string[] {
  const variables: string[] = [];

  // Add function parameters if inside a function
  if (parentFunction) {
    variables.push(...parentFunction.parameters);
  }

  // Collect variables from blocks (up to current block if specified)
  const collectVariables = (blockList: Block[], stopAtId?: string): boolean => {
    for (const block of blockList) {
      if (stopAtId && block.id === stopAtId) {
        return true; // Stop here
      }

      // Add variable names
      if (block.type === 'variable') {
        variables.push(block.name);
      }

      // Add loop iterators
      if (block.type === 'for') {
        variables.push(block.iterator);

        // Recursively collect from children
        if (block.children) {
          const stopped = collectVariables(block.children, stopAtId);
          if (stopped) return true;
        }
      }

      // Recursively collect from if/else children
      if (block.type === 'if') {
        if (block.children) {
          const stopped = collectVariables(block.children, stopAtId);
          if (stopped) return true;
        }
        if (block.elseChildren) {
          const stopped = collectVariables(block.elseChildren, stopAtId);
          if (stopped) return true;
        }
      }

      // Recursively collect from function children
      if (block.type === 'function') {
        if (block.children) {
          const stopped = collectVariables(block.children, stopAtId);
          if (stopped) return true;
        }
      }
    }
    return false;
  };

  collectVariables(blocks, currentBlockId);

  // Remove duplicates and return
  return [...new Set(variables)];
}

/**
 * Gets variables available in a function scope
 */
export function getVariablesInFunction(functionBlock: FunctionBlock): string[] {
  const variables: string[] = [...functionBlock.parameters];

  const collectFromChildren = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.type === 'variable') {
        variables.push(block.name);
      }
      if (block.type === 'for') {
        variables.push(block.iterator);
        if (block.children) {
          collectFromChildren(block.children);
        }
      }
      if (block.type === 'if') {
        if (block.children) {
          collectFromChildren(block.children);
        }
        if (block.elseChildren) {
          collectFromChildren(block.elseChildren);
        }
      }
      if (block.type === 'function' && block.children) {
        collectFromChildren(block.children);
      }
    }
  };

  if (functionBlock.children) {
    collectFromChildren(functionBlock.children);
  }

  return [...new Set(variables)];
}