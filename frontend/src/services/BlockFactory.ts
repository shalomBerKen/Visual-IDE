import type {
  Block,
  FunctionBlock,
  VariableBlock,
  IfBlock,
  ForBlock,
  ReturnBlock,
  BlockType
} from '../types/blocks';

/**
 * Factory for creating block instances with default values
 * Centralizes block creation logic for maintainability and consistency
 */
export class BlockFactory {
  /**
   * Generate a unique ID for a block
   */
  private static generateId(type: string): string {
    return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new block of the specified type with default values
   */
  static createBlock(type: BlockType | string, customId?: string): Block | null {
    const id = customId || this.generateId(type);

    switch (type) {
      case 'function':
        return this.createFunctionBlock(id);

      case 'variable':
        return this.createVariableBlock(id);

      case 'if':
        return this.createIfBlock(id);

      case 'for':
        return this.createForBlock(id);

      case 'return':
        return this.createReturnBlock(id);

      default:
        console.warn(`Unknown block type: ${type}`);
        return null;
    }
  }

  /**
   * Create a function block with default values
   */
  static createFunctionBlock(id?: string): FunctionBlock {
    return {
      id: id || this.generateId('function'),
      type: 'function',
      name: 'new_function',
      parameters: [],
      children: [],
    };
  }

  /**
   * Create a variable block with default values
   */
  static createVariableBlock(id?: string): VariableBlock {
    return {
      id: id || this.generateId('variable'),
      type: 'variable',
      name: 'new_var',
      value: '0',
    };
  }

  /**
   * Create an if/else block with default values
   */
  static createIfBlock(id?: string): IfBlock {
    return {
      id: id || this.generateId('if'),
      type: 'if',
      condition: 'True',
      ifBody: [],
      elseType: 'none',
      elseBody: [],
    };
  }

  /**
   * Create a for loop block with default values
   */
  static createForBlock(id?: string): ForBlock {
    return {
      id: id || this.generateId('for'),
      type: 'for',
      iterator: 'i',
      iterable: 'range(10)',
      children: [],
    };
  }

  /**
   * Create a return statement block with default values
   */
  static createReturnBlock(id?: string): ReturnBlock {
    return {
      id: id || this.generateId('return'),
      type: 'return',
      value: 'None',
    };
  }

  /**
   * Create a block with custom initial values
   * Useful for importing or templating
   */
  static createBlockWithValues<T extends Block>(
    type: BlockType,
    values: Partial<Omit<T, 'id' | 'type'>>
  ): T | null {
    const baseBlock = this.createBlock(type);
    if (!baseBlock) return null;

    return {
      ...baseBlock,
      ...values,
    } as T;
  }

  /**
   * Clone an existing block with a new ID
   * Useful for copy/paste functionality
   */
  static cloneBlock(block: Block): Block {
    const clonedBlock = { ...block, id: this.generateId(block.type) };

    // Deep clone children arrays
    if (block.type === 'function') {
      return {
        ...clonedBlock,
        children: block.children.map(child => this.cloneBlock(child))
      } as FunctionBlock;
    }

    if (block.type === 'if') {
      return {
        ...clonedBlock,
        ifBody: block.ifBody.map(child => this.cloneBlock(child)),
        elseBody: block.elseBody.map(child => this.cloneBlock(child))
      } as IfBlock;
    }

    if (block.type === 'for') {
      return {
        ...clonedBlock,
        children: block.children.map(child => this.cloneBlock(child))
      } as ForBlock;
    }

    return clonedBlock;
  }

  /**
   * Get default values for a block type
   * Useful for UI placeholders
   */
  static getDefaultValues(type: BlockType): Record<string, any> {
    switch (type) {
      case 'function':
        return { name: 'new_function', parameters: [] };
      case 'variable':
        return { name: 'new_var', value: '0' };
      case 'if':
        return { condition: 'True' };
      case 'for':
        return { iterator: 'i', iterable: 'range(10)' };
      case 'return':
        return { value: 'None' };
      default:
        return {};
    }
  }
}