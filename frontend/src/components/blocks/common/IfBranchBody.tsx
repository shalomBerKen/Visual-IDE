import React, { useState } from 'react';
import type { Block } from '../../../types/blocks';
import { BlockRenderer } from '../BlockRenderer';
import { AddStatementMenu } from './AddStatementMenu';

interface IfBranchBodyProps {
  title: string;
  titleColor: string;
  titleBgColor: string;
  children: Block[];
  onUpdateChild: (childId: string, updated: Block) => void;
  onDeleteChild: (childId: string) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  parentId?: string;
  availableVariables?: string[];
  addButtonColor?: string;
  menuColor?: 'blue' | 'orange' | 'purple';
  showAddButton?: boolean;
}

/**
 * Component for rendering if/else branch bodies
 * Handles TRUE and FALSE branches with consistent styling
 */
export const IfBranchBody: React.FC<IfBranchBodyProps> = ({
  title,
  titleColor,
  titleBgColor,
  children,
  onUpdateChild,
  onDeleteChild,
  onAddChild,
  parentId,
  availableVariables = [],
  addButtonColor = 'border-gray-300 text-gray-600 hover:border-gray-500',
  menuColor = 'blue',
  showAddButton = true
}) => {
  return (
    <div className="space-y-2 min-h-[120px]">
      {children.length > 0 ? (
        children.map((child) => (
          <BlockRenderer
            key={child.id}
            block={child}
            onUpdate={(updated) => onUpdateChild(child.id, updated)}
            onDelete={(childId) => onDeleteChild(childId)}
            onAddChild={onAddChild}
            availableVariables={availableVariables}
          />
        ))
      ) : (
        <div className="text-gray-400 italic text-xs py-3 text-center border-2 border-dashed border-gray-300 rounded">
          Empty
        </div>
      )}

      {showAddButton && onAddChild && parentId && (
        <AddStatementMenu
          onAdd={(type) => onAddChild(parentId, type)}
          color={menuColor}
        />
      )}
    </div>
  );
};
