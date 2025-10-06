import React, { useState } from 'react';

interface AddStatementMenuProps {
  onAdd: (blockType: string) => void;
  color?: 'blue' | 'orange' | 'purple';
}

const colorClasses = {
  blue: 'hover:border-blue-400 hover:text-blue-600',
  orange: 'hover:border-orange-400 hover:text-orange-600',
  purple: 'hover:border-purple-400 hover:text-purple-600',
};

/**
 * Unified menu for adding statements to block bodies
 * Replaces duplicate menu code in Function, For, and If blocks
 */
export const AddStatementMenu: React.FC<AddStatementMenuProps> = ({
  onAdd,
  color = 'blue'
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAdd = (type: string) => {
    onAdd(type);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 ${colorClasses[color]} transition-colors`}
      >
        + Add Statement
      </button>

      {showMenu && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
          <button
            onClick={() => handleAdd('variable')}
            className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 border-b border-gray-200"
          >
            Variable
          </button>
          <button
            onClick={() => handleAdd('function')}
            className="w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-700 border-b border-gray-200"
          >
            Function
          </button>
          <button
            onClick={() => handleAdd('if')}
            className="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700 border-b border-gray-200"
          >
            If/Else
          </button>
          <button
            onClick={() => handleAdd('for')}
            className="w-full px-4 py-2 text-left hover:bg-orange-50 text-orange-700 border-b border-gray-200"
          >
            For Loop
          </button>
          <button
            onClick={() => handleAdd('return')}
            className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-700 border-b border-gray-200"
          >
            Return
          </button>
          <button
            onClick={() => handleAdd('functionCall')}
            className="w-full px-4 py-2 text-left hover:bg-cyan-50 text-cyan-700"
          >
            Call Function
          </button>
        </div>
      )}
    </div>
  );
};
