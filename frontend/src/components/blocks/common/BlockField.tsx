import React, { ReactNode } from 'react';

interface BlockFieldProps {
  label: string;
  labelWidth?: string;
  children: ReactNode;
}

/**
 * Unified field component for block inputs
 * Provides consistent label + input layout
 */
export const BlockField: React.FC<BlockFieldProps> = ({
  label,
  labelWidth = 'w-24',
  children,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className={`text-sm font-medium text-gray-700 ${labelWidth}`}>
        {label}
      </label>
      {children}
    </div>
  );
};
