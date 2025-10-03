import React, { useState } from 'react';

interface FalseHandlingButtonProps {
  onAddElse: () => void;
  onAddElif: () => void;
}

/**
 * Button for adding else/elif to an if block
 * Shows options menu when clicked
 */
export const FalseHandlingButton: React.FC<FalseHandlingButtonProps> = ({
  onAddElse,
  onAddElif
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative min-h-[80px] flex items-center justify-center">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="w-full py-3 px-4 border-2 border-dashed border-gray-400 rounded-md text-gray-600 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-colors text-sm font-medium"
      >
        🔘 Add False Handling
      </button>

      {showOptions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-purple-300 rounded-md shadow-lg z-50">
          <button
            onClick={() => {
              onAddElif();
              setShowOptions(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-purple-50 border-b border-gray-200"
          >
            <div className="font-semibold text-purple-700 text-sm">🟣 Add Condition (elif)</div>
            <div className="text-xs text-gray-600 mt-0.5">Check another condition if this one is false</div>
          </button>
          <button
            onClick={() => {
              onAddElse();
              setShowOptions(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-50"
          >
            <div className="font-semibold text-gray-700 text-sm">◼ Add Else</div>
            <div className="text-xs text-gray-600 mt-0.5">Run code when condition is false</div>
          </button>
        </div>
      )}
    </div>
  );
};
