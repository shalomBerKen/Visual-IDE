import React, { useState, useRef, useEffect } from 'react';
import type { ComplexValue, ArrayValue, ObjectValue, SimpleValue } from '../../types/values';
import { createSimpleValue, createArrayValue, createObjectValue } from '../../types/values';

interface ValueTreeEditorProps {
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
  availableVariables?: string[];
}

/**
 * VSCode Preferences style cascading panels - SIMPLIFIED
 */
export const ValueTreeEditor: React.FC<ValueTreeEditorProps> = ({
  value,
  onChange,
  availableVariables = []
}) => {
  const [openPanels, setOpenPanels] = useState<Array<{
    path: number[];
    value: ComplexValue;
    position: number;
    depth: number;
  }>>([]);

  const handlePanelToggle = (item: { path: number[]; value: ComplexValue; position: number }, depth: number) => {
    setOpenPanels(prev => {
      // Check if this exact panel is already open
      const existingIndex = prev.findIndex(
        p => p.depth === depth && JSON.stringify(p.path) === JSON.stringify(item.path)
      );

      if (existingIndex >= 0) {
        // Close this panel and all deeper ones
        return prev.filter(p => p.depth < depth);
      } else {
        // Open this panel, close all at same depth or deeper
        const filtered = prev.filter(p => p.depth < depth);
        return [...filtered, { ...item, depth }];
      }
    });
  };

  return (
    <div className="relative flex bg-white border border-gray-200 rounded-lg overflow-visible min-h-[300px]">
      <RootPanel
        value={value}
        onChange={onChange}
        availableVariables={availableVariables}
        onPanelToggle={(item) => handlePanelToggle(item, 0)}
      />

      {openPanels.map((panel, index) => (
        <NestedPanel
          key={`${panel.path.join('-')}-${index}`}
          value={value}
          panelValue={panel.value}
          path={panel.path}
          position={panel.position}
          depth={panel.depth}
          onChange={onChange}
          availableVariables={availableVariables}
          onPanelToggle={(item) => handlePanelToggle(item, panel.depth + 1)}
        />
      ))}
    </div>
  );
};

// Helper: Update value at path
function updateValueAtPath(root: ComplexValue, path: number[], newValue: ComplexValue): ComplexValue {
  if (path.length === 0) return newValue;

  const [first, ...rest] = path;

  if (root.type === 'array') {
    const newItems = [...root.items];
    if (rest.length === 0) {
      newItems[first] = newValue;
    } else {
      newItems[first] = updateValueAtPath(newItems[first], rest, newValue);
    }
    return { ...root, items: newItems };
  }

  if (root.type === 'object') {
    const newProps = [...root.properties];
    if (rest.length === 0) {
      newProps[first] = { ...newProps[first], value: newValue };
    } else {
      newProps[first] = { ...newProps[first], value: updateValueAtPath(newProps[first].value, rest, newValue) };
    }
    return { ...root, properties: newProps };
  }

  return root;
}

// Helper: Get value at path
function getValueAtPath(root: ComplexValue, path: number[]): ComplexValue | null {
  if (path.length === 0) return root;

  const [first, ...rest] = path;

  if (root.type === 'array' && first < root.items.length) {
    return rest.length === 0 ? root.items[first] : getValueAtPath(root.items[first], rest);
  }

  if (root.type === 'object' && first < root.properties.length) {
    return rest.length === 0 ? root.properties[first].value : getValueAtPath(root.properties[first].value, rest);
  }

  return null;
}

interface RootPanelProps {
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
  availableVariables: string[];
  onPanelToggle: (item: { path: number[]; value: ComplexValue; position: number }) => void;
}

const RootPanel: React.FC<RootPanelProps> = ({ value, onChange, availableVariables, onPanelToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Empty state
  if (value.type === 'simple' && !value.value) {
    return (
      <div className="w-64 p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Choose type:</div>
        <div className="space-y-1">
          <button
            onClick={() => setIsEditing(true)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded"
          >
            Value
          </button>
          <button
            onClick={() => onChange(createArrayValue([]))}
            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded"
          >
            Array
          </button>
          <button
            onClick={() => onChange(createObjectValue([]))}
            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer rounded"
          >
            Object
          </button>
        </div>

        {isEditing && (
          <div className="mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onChange(createSimpleValue(inputValue));
                  setIsEditing(false);
                }
                if (e.key === 'Escape') setIsEditing(false);
              }}
              placeholder="Enter value"
              className="w-full px-3 py-2 border border-blue-400 rounded text-sm focus:outline-none"
              autoFocus
            />
          </div>
        )}
      </div>
    );
  }

  // Simple value
  if (value.type === 'simple') {
    return (
      <div className="w-64 p-4">
        <ValueEditor value={value} onChange={onChange} />
      </div>
    );
  }

  // Array
  if (value.type === 'array') {
    return (
      <div className="w-64">
        <div className="p-4 pb-0">
          <div className="text-xs font-semibold text-gray-500 mb-3">ARRAY [{value.items.length}]</div>
        </div>
        <div className="space-y-1">
          {value.items.map((item, index) => (
            <ArrayItemRow
              key={index}
              item={item}
              index={index}
              onClick={(pos) => {
                if (item.type !== 'simple') {
                  onPanelToggle({ path: [index], value: item, position: pos });
                }
              }}
              onEdit={(newVal) => {
                const newItems = [...value.items];
                newItems[index] = newVal;
                onChange({ ...value, items: newItems });
              }}
              onDelete={() => {
                onChange({ ...value, items: value.items.filter((_, i) => i !== index) });
              }}
            />
          ))}
          <AddArrayItem
            onAdd={(newItem) => {
              onChange({ ...value, items: [...value.items, newItem] });
            }}
          />
        </div>
      </div>
    );
  }

  // Object
  if (value.type === 'object') {
    return (
      <div className="w-64">
        <div className="p-4 pb-0">
          <div className="text-xs font-semibold text-gray-500 mb-3">OBJECT {`{${value.properties.length}}`}</div>
        </div>
        <div className="space-y-1">
          {value.properties.map((prop, index) => (
            <ObjectPropertyRow
              key={index}
              property={prop}
              index={index}
              onClick={(pos) => {
                if (prop.value.type !== 'simple') {
                  onPanelToggle({ path: [index], value: prop.value, position: pos });
                }
              }}
              onEdit={(newVal) => {
                const newProps = [...value.properties];
                newProps[index] = { ...newProps[index], value: newVal };
                onChange({ ...value, properties: newProps });
              }}
              onKeyChange={(newKey) => {
                const newProps = [...value.properties];
                newProps[index] = { ...newProps[index], key: newKey };
                onChange({ ...value, properties: newProps });
              }}
              onDelete={() => {
                onChange({ ...value, properties: value.properties.filter((_, i) => i !== index) });
              }}
            />
          ))}
          <AddObjectProperty
            onAdd={(key, newValue) => {
              onChange({ ...value, properties: [...value.properties, { key, value: newValue }] });
            }}
          />
        </div>
      </div>
    );
  }

  return null;
};

interface NestedPanelProps {
  value: ComplexValue;
  panelValue: ComplexValue;
  path: number[];
  position: number;
  depth: number;
  onChange: (value: ComplexValue) => void;
  availableVariables: string[];
  onPanelToggle: (item: { path: number[]; value: ComplexValue; position: number }) => void;
}

const NestedPanel: React.FC<NestedPanelProps> = ({
  value,
  panelValue,
  path,
  position,
  depth,
  onChange,
  availableVariables,
  onPanelToggle
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (panelRef.current) {
      const container = panelRef.current.closest('.flex');
      if (container) {
        const rect = container.getBoundingClientRect();
        setTop(position - rect.top);
      }
    }
  }, [position]);

  const handleChange = (newValue: ComplexValue) => {
    onChange(updateValueAtPath(value, path, newValue));
  };

  // Get the current value from the root based on path (not the snapshot)
  const currentValue = getValueAtPath(value, path) || panelValue;

  return (
    <div
      ref={panelRef}
      className="cascading-panel absolute bg-white border-l border-gray-200 shadow-lg"
      style={{ top: `${top}px`, left: `${256 * (depth + 1)}px` }}
    >
      <RootPanel
        value={currentValue}
        onChange={handleChange}
        availableVariables={availableVariables}
        onPanelToggle={onPanelToggle}
      />
    </div>
  );
};

// Simple value editor
const ValueEditor: React.FC<{ value: SimpleValue; onChange: (v: SimpleValue) => void }> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(!value.value);
  const [inputValue, setInputValue] = useState(value.value);

  if (isEditing) {
    return (
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-2">VALUE</div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onChange({ type: 'simple', value: inputValue });
              setIsEditing(false);
            }
            if (e.key === 'Escape') {
              setInputValue(value.value);
              if (value.value) setIsEditing(false);
            }
          }}
          onBlur={() => {
            onChange({ type: 'simple', value: inputValue });
            setIsEditing(false);
          }}
          placeholder="Enter value"
          className="w-full px-3 py-2 border border-blue-400 rounded text-sm font-mono focus:outline-none"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 mb-2">VALUE</div>
      <div
        onClick={() => setIsEditing(true)}
        className="px-3 py-2 bg-gray-50 rounded cursor-text hover:bg-gray-100 font-mono text-sm"
      >
        {value.value || <span className="text-gray-400">Click to edit</span>}
      </div>
    </div>
  );
};

// Array item row
const ArrayItemRow: React.FC<{
  item: ComplexValue;
  index: number;
  onClick: (position: number) => void;
  onEdit: (value: ComplexValue) => void;
  onDelete: () => void;
}> = ({ item, index, onClick, onEdit, onDelete }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(item.type === 'simple' ? item.value : '');

  const handleClick = () => {
    if (rowRef.current && item.type !== 'simple') {
      onClick(rowRef.current.getBoundingClientRect().top);
    }
  };

  if (item.type === 'simple') {
    if (isEditing) {
      return (
        <div ref={rowRef} className="flex items-center gap-2 px-3 py-2">
          <span className="text-xs text-gray-500 font-mono">[{index}]</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEdit(createSimpleValue(inputValue));
                setIsEditing(false);
              }
              if (e.key === 'Escape') setIsEditing(false);
            }}
            onBlur={() => {
              onEdit(createSimpleValue(inputValue));
              setIsEditing(false);
            }}
            className="flex-1 px-2 py-1 border border-blue-400 rounded text-xs font-mono"
            autoFocus
          />
        </div>
      );
    }

    return (
      <div ref={rowRef} className="group flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded">
        <span className="text-xs text-gray-500 font-mono">[{index}]</span>
        <span
          onClick={() => setIsEditing(true)}
          className="text-xs text-gray-700 font-mono cursor-text hover:text-blue-600"
        >
          {item.value || <span className="text-gray-400">empty</span>}
        </span>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={rowRef}
      onClick={handleClick}
      className="group flex items-center justify-between px-3 py-2 hover:bg-blue-50 rounded cursor-pointer"
    >
      <span className="text-xs text-gray-500 font-mono">[{index}]</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{item.type}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

// Object property row
const ObjectPropertyRow: React.FC<{
  property: { key: string; value: ComplexValue };
  index: number;
  onClick: (position: number) => void;
  onEdit: (value: ComplexValue) => void;
  onKeyChange: (key: string) => void;
  onDelete: () => void;
}> = ({ property, index, onClick, onEdit, onKeyChange, onDelete }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [keyInput, setKeyInput] = useState(property.key);
  const [valueInput, setValueInput] = useState(property.value.type === 'simple' ? property.value.value : '');

  const handleClick = () => {
    if (rowRef.current && property.value.type !== 'simple' && !isEditingKey) {
      onClick(rowRef.current.getBoundingClientRect().top);
    }
  };

  if (property.value.type === 'simple') {
    return (
      <div ref={rowRef} className="group px-3 py-2 hover:bg-gray-50 rounded">
        <div className="flex items-center justify-between mb-1">
          {isEditingKey ? (
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onKeyChange(keyInput);
                  setIsEditingKey(false);
                }
                if (e.key === 'Escape') setIsEditingKey(false);
              }}
              onBlur={() => {
                onKeyChange(keyInput);
                setIsEditingKey(false);
              }}
              className="flex-1 px-2 py-1 border border-blue-400 rounded text-sm font-mono"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditingKey(true)}
              className="text-sm font-mono cursor-text hover:text-blue-600"
            >
              {property.key}
            </span>
          )}
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-500"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {isEditingValue ? (
          <input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEdit(createSimpleValue(valueInput));
                setIsEditingValue(false);
              }
              if (e.key === 'Escape') setIsEditingValue(false);
            }}
            onBlur={() => {
              onEdit(createSimpleValue(valueInput));
              setIsEditingValue(false);
            }}
            className="w-full px-2 py-1 border border-blue-400 rounded text-xs font-mono"
            autoFocus
          />
        ) : (
          <span
            onClick={() => setIsEditingValue(true)}
            className="text-xs text-gray-700 font-mono cursor-text hover:text-blue-600 block"
          >
            {property.value.value || <span className="text-gray-400">empty</span>}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={rowRef}
      onClick={handleClick}
      className="group flex items-center justify-between px-3 py-2 hover:bg-blue-50 rounded cursor-pointer"
    >
      {isEditingKey ? (
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onKeyChange(keyInput);
              setIsEditingKey(false);
            }
            if (e.key === 'Escape') setIsEditingKey(false);
          }}
          onBlur={() => {
            onKeyChange(keyInput);
            setIsEditingKey(false);
          }}
          className="flex-1 px-2 py-1 border border-blue-400 rounded text-sm font-mono"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingKey(true);
          }}
          className="text-sm font-mono cursor-text hover:text-blue-600"
        >
          {property.key}
        </span>
      )}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{property.value.type}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

// Add array item
const AddArrayItem: React.FC<{ onAdd: (value: ComplexValue) => void }> = ({ onAdd }) => {
  const [mode, setMode] = useState<'menu' | 'value' | null>(null);
  const [inputValue, setInputValue] = useState('');

  if (mode === 'value') {
    return (
      <div className="px-3 py-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAdd(createSimpleValue(inputValue));
              setInputValue('');
              setMode(null);
            }
            if (e.key === 'Escape') setMode(null);
          }}
          placeholder="Enter value"
          className="w-full px-3 py-2 border border-blue-400 rounded text-sm font-mono"
          autoFocus
        />
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => setMode('value')}
          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
        >
          Value
        </button>
        <button
          onClick={() => { onAdd(createArrayValue([])); setMode(null); }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
        >
          Array
        </button>
        <button
          onClick={() => { onAdd(createObjectValue([])); setMode(null); }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
        >
          Object
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setMode('menu')}
      className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer rounded"
    >
      + Add item
    </div>
  );
};

// Add object property
const AddObjectProperty: React.FC<{ onAdd: (key: string, value: ComplexValue) => void }> = ({ onAdd }) => {
  const [mode, setMode] = useState<'menu' | 'key' | 'value' | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  if (mode === 'value') {
    return (
      <div className="px-3 py-2">
        <div className="text-xs text-gray-500 mb-1">{keyInput}:</div>
        <input
          type="text"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAdd(keyInput, createSimpleValue(valueInput));
              setKeyInput('');
              setValueInput('');
              setMode(null);
            }
            if (e.key === 'Escape') setMode(null);
          }}
          placeholder="Enter value"
          className="w-full px-3 py-2 border border-blue-400 rounded text-sm font-mono"
          autoFocus
        />
      </div>
    );
  }

  if (mode === 'menu') {
    return (
      <div className="px-3 py-2 space-y-1">
        <div className="text-xs text-gray-500 mb-2">{keyInput}:</div>
        <button
          onClick={() => setMode('value')}
          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
        >
          Value
        </button>
        <button
          onClick={() => {
            onAdd(keyInput, createArrayValue([]));
            setKeyInput('');
            setMode(null);
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
        >
          Array
        </button>
        <button
          onClick={() => {
            onAdd(keyInput, createObjectValue([]));
            setKeyInput('');
            setMode(null);
          }}
          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
        >
          Object
        </button>
      </div>
    );
  }

  if (mode === 'key') {
    return (
      <div className="px-3 py-2">
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && keyInput.trim()) {
              setMode('menu');
            }
            if (e.key === 'Escape') setMode(null);
          }}
          placeholder="Property name"
          className="w-full px-3 py-2 border border-blue-400 rounded text-sm font-mono"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setMode('key')}
      className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer rounded"
    >
      + Add property
    </div>
  );
};
