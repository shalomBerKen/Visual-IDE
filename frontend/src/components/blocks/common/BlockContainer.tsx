import React, { ReactNode } from 'react';

interface BlockContainerProps {
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  children: ReactNode;
  minWidth?: string;
}

const colorClasses = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  purple: 'border-purple-500',
  orange: 'border-orange-500',
  red: 'border-red-500',
  cyan: 'border-cyan-500',
};

/**
 * Unified container wrapper for all block types
 * Provides consistent styling and spacing
 */
export const BlockContainer: React.FC<BlockContainerProps> = ({
  color,
  children,
  minWidth = '[350px]'
}) => {
  return (
    <div className={`border-2 ${colorClasses[color]} rounded-lg p-4 bg-white shadow-lg mb-4 min-w-${minWidth} w-fit`}>
      {children}
    </div>
  );
};
