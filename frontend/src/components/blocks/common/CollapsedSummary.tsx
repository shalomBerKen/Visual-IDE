import React from 'react';

interface CollapsedSummaryProps {
  summary: string | React.ReactNode;
}

/**
 * Unified component for collapsed block summary
 * Shows when block is not expanded
 */
export const CollapsedSummary: React.FC<CollapsedSummaryProps> = ({ summary }) => {
  return (
    <div className="pl-6 text-sm text-gray-600">
      <span className="font-mono">
        {summary}
      </span>
    </div>
  );
};
