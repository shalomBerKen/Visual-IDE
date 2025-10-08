import React, { useState, useRef, useEffect } from 'react';

interface InlineEditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

/**
 * Inline editor for simple values
 * Shows an input field for editing, ESC to cancel, Enter to save
 */
export const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onSave,
  onCancel,
  placeholder = 'Enter value...'
}) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave(editValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    onSave(editValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder={placeholder}
      className="px-3 py-2 border border-blue-400 rounded bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{ minWidth: '100px', maxWidth: '300px' }}
    />
  );
};
