import React from 'react';
import type { Block } from '../../../types/blocks';
import { BlockRenderer } from '../BlockRenderer';
import { AddStatementMenu } from './AddStatementMenu';

interface BlockBodyProps {
  title?: string;
  children: Block[];
  onUpdateChild: (childId: string, updated: Block) => void;
  onDeleteChild: (childId: string) => void;
  onAddChild?: (parentId: string, blockType: string) => void;
  parentId?: string;
  availableVariables?: string[];
  emptyMessage?: string;
  backgroundColor?: string;
  menuColor?: 'blue' | 'orange' | 'purple';
}

/**
 * Unified component for rendering block children (body)
 * Handles all the repetitive child rendering logic
 */
export const BlockBody: React.FC<BlockBodyProps> = ({
  title = 'Body:',
  children,
  onUpdateChild,
  onDeleteChild,
  onAddChild,
  parentId,
  availableVariables = [],
  emptyMessage = 'Empty body',
  backgroundColor = 'bg-gray-50',
  menuColor = 'blue'
}) => {
  return (
    <div className="mt-4 border-t pt-4">
      {title && (
        <div className="text-sm font-medium text-gray-700 mb-2">
          {title}
        </div>
      )}
      <div className={`ml-4 space-y-2 ${backgroundColor} rounded p-3 min-w-[300px]`}>
        {children.length > 0 ? (
          children.map((child) => (
            <BlockRenderer
              key={child.id}
              block={child}
              onUpdate={(updated) => onUpdateChild(child.id, updated)}
              onDelete={() => onDeleteChild(child.id)}
              onAddChild={onAddChild}
              availableVariables={availableVariables}
            />
          ))
        ) : (
          <div className="text-gray-400 italic text-sm py-3 text-center border-2 border-dashed border-gray-300 rounded bg-white">
            {emptyMessage}
          </div>
        )}

        {onAddChild && parentId && (
          <AddStatementMenu onAdd={(type) => onAddChild(parentId, type)} color={menuColor} />
        )}
      </div>
    </div>
  );
};
