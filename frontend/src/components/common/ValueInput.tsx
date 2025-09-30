import React, { useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  availableVariables?: string[];
  className?: string;
}

export const ValueInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'value',
  availableVariables = [],
  className = ''
}) => {
  const [showVariablesMenu, setShowVariablesMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const insertVariable = (variable: string) => {
    const newValue = value ? `${value} ${variable}` : variable;
    onChange(newValue);
    setShowVariablesMenu(false);
    inputRef.current?.focus();
  };

  // Render value with highlighted variables
  const renderHighlightedValue = () => {
    if (!availableVariables.length || !value) return null;

    const parts: Array<{ text: string; isVar: boolean }> = [];
    let remaining = value;

    // Split by common operators and spaces while keeping them
    const tokens = remaining.split(/(\s+|[+\-*/=<>!()[\]{},.:])/);

    tokens.forEach(token => {
      if (availableVariables.includes(token.trim())) {
        parts.push({ text: token, isVar: true });
      } else if (token) {
        parts.push({ text: token, isVar: false });
      }
    });

    return (
      <div className="absolute inset-0 pointer-events-none flex items-center px-3 py-2">
        <div className="flex flex-wrap items-center gap-0.5 opacity-0">
          {parts.map((part, i) => (
            part.isVar ? (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-sm font-mono border border-green-300"
              >
                {part.text}
              </span>
            ) : (
              <span key={i} className="text-sm">
                {part.text}
              </span>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex-1">
      <div className="flex gap-1">
        {/* Input field */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              availableVariables.length > 0 && value ? 'text-transparent caret-black' : ''
            } ${className}`}
            style={availableVariables.length > 0 && value ? { caretColor: 'black' } : {}}
            placeholder={placeholder}
          />
          {/* Visual representation of variables */}
          {availableVariables.length > 0 && value && (
            <div className="absolute inset-0 pointer-events-none flex items-center px-3 py-2 overflow-hidden">
              <div className="flex flex-wrap items-center gap-0.5 font-mono text-sm">
                {value.split(/(\s+|[+\-*/=<>!()[\]{},.:]|(?<=[a-zA-Z0-9_])(?=[+\-*/=<>!()[\]{},.:])|(?<=[+\-*/=<>!()[\]{},.]:])(?=[a-zA-Z0-9_]))/).map((token, i) => {
                  const trimmed = token.trim();
                  if (availableVariables.includes(trimmed)) {
                    return (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded font-mono border border-green-300 shadow-sm font-semibold"
                      >
                        {token}
                      </span>
                    );
                  } else if (token) {
                    return (
                      <span key={i} className="text-gray-900">
                        {token}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Variables menu button */}
        {availableVariables.length > 0 && (
          <button
            onClick={() => setShowVariablesMenu(!showVariablesMenu)}
            onBlur={() => setTimeout(() => setShowVariablesMenu(false), 200)}
            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
            title="Insert variable"
          >
            📦
          </button>
        )}
      </div>

      {/* Variables dropdown menu */}
      {showVariablesMenu && availableVariables.length > 0 && (
        <div className="absolute z-20 mt-1 right-0 bg-white border-2 border-green-300 rounded-md shadow-lg max-h-48 overflow-y-auto min-w-[200px]">
          <div className="px-3 py-2 bg-green-50 border-b border-green-200">
            <span className="text-xs font-semibold text-green-800">Available Variables</span>
          </div>
          {availableVariables.map((variable, index) => (
            <button
              key={index}
              onClick={() => insertVariable(variable)}
              className="w-full px-3 py-2 text-left hover:bg-green-50 border-b border-gray-100 last:border-b-0 flex items-center gap-2 transition-colors"
            >
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-mono font-semibold border border-green-300">
                {variable}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};