import React from 'react';
import type {
  Block,
  FunctionBlock as FunctionBlockType,
  VariableBlock as VariableBlockType,
  IfBlock as IfBlockType,
  ForBlock as ForBlockType,
  ReturnBlock as ReturnBlockType
} from '../../types/blocks';
import { FunctionBlock } from './FunctionBlock';
import { VariableBlock } from './VariableBlock';
import { IfBlock } from './IfBlock';
import { ForBlock } from './ForBlock';
import { ReturnBlock } from './ReturnBlock';

interface Props {
  block: Block;
  onUpdate?: (block: Block) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  availableVariables?: string[];
}

export const BlockRenderer: React.FC<Props> = ({ block, onUpdate, onAddChild, availableVariables = [] }) => {
  switch (block.type) {
    case 'function':
      return (
        <FunctionBlock
          block={block as FunctionBlockType}
          onUpdate={onUpdate}
          onAddChild={onAddChild}
        />
      );
    case 'variable':
      return (
        <VariableBlock
          block={block as VariableBlockType}
          onUpdate={onUpdate}
          availableVariables={availableVariables}
        />
      );
    case 'if':
      return (
        <IfBlock
          block={block as IfBlockType}
          onUpdate={onUpdate}
          onAddChild={onAddChild}
          availableVariables={availableVariables}
        />
      );
    case 'for':
      return (
        <ForBlock
          block={block as ForBlockType}
          onUpdate={onUpdate}
          onAddChild={onAddChild}
          availableVariables={availableVariables}
        />
      );
    case 'return':
      return (
        <ReturnBlock
          block={block as ReturnBlockType}
          onUpdate={onUpdate}
          availableVariables={availableVariables}
        />
      );
    default:
      return null;
  }
};