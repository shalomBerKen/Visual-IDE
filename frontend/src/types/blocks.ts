// Core types for Visual IDE

export type BlockType =
  | 'function'
  | 'variable'
  | 'if'
  | 'for'
  | 'return';

export interface BaseBlock {
  id: string;
  type: BlockType;
  children?: Block[];
}

export interface FunctionBlock extends BaseBlock {
  type: 'function';
  name: string;
  parameters: string[];
  children: Block[];
}

export interface VariableBlock extends BaseBlock {
  type: 'variable';
  name: string;
  value: string;
}

export type ElseType = 'none' | 'elif' | 'else';

export interface IfBlock extends BaseBlock {
  type: 'if';
  condition: string;
  ifBody: Block[];
  elseType: ElseType;  // Determines what kind of else branch this has
  elseBody: Block[];   // If elseType='elif', must contain exactly one IfBlock
}

export interface ForBlock extends BaseBlock {
  type: 'for';
  iterator: string;
  iterable: string;
  children: Block[];
}

export interface ReturnBlock extends BaseBlock {
  type: 'return';
  value: string;
}

export type Block =
  | FunctionBlock
  | VariableBlock
  | IfBlock
  | ForBlock
  | ReturnBlock;

// Re-export types explicitly
export type {
  FunctionBlock,
  VariableBlock,
  IfBlock,
  ForBlock,
  ReturnBlock
};