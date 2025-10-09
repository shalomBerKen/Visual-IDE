import React, { useState, useRef } from 'react';
import type { ComplexValue, ArrayValue, ObjectValue, SimpleValue } from '../../types/values';
import { ChevronRight, Plus } from 'lucide-react';
import { AddArrayItemModal, AddObjectPropertyModal } from '../modals/AddValueModal';
import { SimpleValueEditModal } from '../modals/SimpleValueEditModal';

interface Props {
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
  availableVariables?: string[];
}

interface OpenPanel {
  path: number[];
  value: ComplexValue;
  position: number;
  depth: number;
}

export const ComplexValueDisplay: React.FC<Props> = ({ value, onChange, availableVariables = [] }) => {
  const [openPanels, setOpenPanels] = useState<OpenPanel[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<{ type: 'array-item' | 'object-prop'; path: number[] } | null>(null);

  const handlePanelToggle = (item: { path: number[]; value: ComplexValue; position: number }, depth: number) => {
    setOpenPanels(prev => {
      const existingIndex = prev.findIndex(
        p => p.depth === depth && JSON.stringify(p.path) === JSON.stringify(item.path)
      );

      if (existingIndex >= 0) {
        return prev.filter(p => p.depth < depth);
      } else {
        const filtered = prev.filter(p => p.depth < depth);
        return [...filtered, { ...item, depth }];
      }
    });
  };

  const handleAddItem = (path: number[]) => {
    setAddModalOpen({ type: 'array-item', path });
  };

  const handleAddProperty = (path: number[]) => {
    setAddModalOpen({ type: 'object-prop', path });
  };

  const updateValueAtPath = (path: number[], updater: (val: ComplexValue) => ComplexValue) => {
    const updateRecursive = (val: ComplexValue, currentPath: number[]): ComplexValue => {
      if (currentPath.length === 0) {
        return updater(val);
      }

      const [index, ...rest] = currentPath;

      if (val.type === 'array') {
        const newItems = [...val.items];
        newItems[index] = updateRecursive(newItems[index], rest);
        return { ...val, items: newItems };
      } else if (val.type === 'object') {
        const newProperties = [...val.properties];
        newProperties[index] = {
          ...newProperties[index],
          value: updateRecursive(newProperties[index].value, rest)
        };
        return { ...val, properties: newProperties };
      }

      return val;
    };

    onChange(updateRecursive(value, path));
  };

  const getValueAtPath = (val: ComplexValue, path: number[]): ComplexValue => {
    if (path.length === 0) return val;

    const [index, ...rest] = path;

    if (val.type === 'array') {
      return getValueAtPath(val.items[index], rest);
    } else if (val.type === 'object') {
      return getValueAtPath(val.properties[index].value, rest);
    }

    return val;
  };

  const handleAddArrayItem = (newItem: ComplexValue) => {
    if (!addModalOpen || addModalOpen.type !== 'array-item') return;

    updateValueAtPath(addModalOpen.path, (val) => {
      if (val.type === 'array') {
        return { ...val, items: [...val.items, newItem] };
      }
      return val;
    });

    setAddModalOpen(null);
  };

  const handleAddObjectProperty = (key: string, newValue: ComplexValue) => {
    if (!addModalOpen || addModalOpen.type !== 'object-prop') return;

    updateValueAtPath(addModalOpen.path, (val) => {
      if (val.type === 'object') {
        return { ...val, properties: [...val.properties, { key, value: newValue }] };
      }
      return val;
    });

    setAddModalOpen(null);
  };

  return (
    <div className="relative">
      <RootPanel
        value={value}
        onChange={onChange}
        onPanelToggle={(item) => handlePanelToggle(item, 1)}
        onAddItem={handleAddItem}
        onAddProperty={handleAddProperty}
        availableVariables={availableVariables}
      />

      {openPanels.map((panel, idx) => (
        <NestedPanel
          key={`${panel.depth}-${JSON.stringify(panel.path)}`}
          value={value}
          path={panel.path}
          panelValue={panel.value}
          top={panel.position}
          depth={panel.depth}
          onPanelToggle={handlePanelToggle}
          onAddItem={handleAddItem}
          onAddProperty={handleAddProperty}
          onChange={(newValue) => {
            updateValueAtPath(panel.path, () => newValue);
          }}
          availableVariables={availableVariables}
        />
      ))}

      <AddArrayItemModal
        isOpen={addModalOpen?.type === 'array-item'}
        onClose={() => setAddModalOpen(null)}
        onAdd={handleAddArrayItem}
      />

      <AddObjectPropertyModal
        isOpen={addModalOpen?.type === 'object-prop'}
        onClose={() => setAddModalOpen(null)}
        onAdd={handleAddObjectProperty}
      />
    </div>
  );
};

interface RootPanelProps {
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
  onPanelToggle: (item: { path: number[]; value: ComplexValue; position: number }) => void;
  onAddItem: (path: number[]) => void;
  onAddProperty: (path: number[]) => void;
  availableVariables?: string[];
}

const RootPanel: React.FC<RootPanelProps> = ({
  value,
  onChange,
  onPanelToggle,
  onAddItem,
  onAddProperty,
  availableVariables = []
}) => {
  if (value.type === 'simple') {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <SimpleValueRow
          value={value}
          availableVariables={availableVariables}
          onChange={onChange}
        />
      </div>
    );
  }

  if (value.type === 'array') {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-500">
              ARRAY [{value.items.length}]
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {value.items.map((item, index) => (
            <ArrayItemRow
              key={index}
              index={index}
              item={item}
              onClick={(pos) => {
                if (item.type !== 'simple') {
                  onPanelToggle({ path: [index], value: item, position: pos });
                }
              }}
              onDelete={() => {
                const newItems = value.items.filter((_, i) => i !== index);
                onChange({ ...value, items: newItems });
              }}
            />
          ))}
        </div>

        <button
          onClick={() => onAddItem([])}
          className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-200"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>
    );
  }

  if (value.type === 'object') {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-500">
              OBJECT [{value.properties.length}]
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {value.properties.map((prop, index) => (
            <ObjectPropertyRow
              key={index}
              index={index}
              property={prop}
              onClick={(pos) => {
                if (prop.value.type !== 'simple') {
                  onPanelToggle({ path: [index], value: prop.value, position: pos });
                }
              }}
              onDelete={() => {
                const newProperties = value.properties.filter((_, i) => i !== index);
                onChange({ ...value, properties: newProperties });
              }}
            />
          ))}
        </div>

        <button
          onClick={() => onAddProperty([])}
          className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-200"
        >
          <Plus size={14} />
          Add Property
        </button>
      </div>
    );
  }

  if (value.type === 'function-call') {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-500 mb-3">
            FUNCTION CALL
          </div>
          <input
            type="text"
            value={value.functionName}
            onChange={(e) => onChange({ ...value, functionName: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            placeholder="Function name..."
          />
          <div className="text-xs font-semibold text-gray-500 mb-2">
            ARGUMENTS [{value.arguments.length}]
          </div>
        </div>

        <div className="space-y-1">
          {value.arguments.map((arg, index) => (
            <FunctionArgumentRow
              key={index}
              index={index}
              argument={arg}
              onClick={(pos) => {
                if (arg.value.type !== 'simple') {
                  onPanelToggle({ path: [index], value: arg.value, position: pos });
                }
              }}
              onDelete={() => {
                const newArguments = value.arguments.filter((_, i) => i !== index);
                onChange({ ...value, arguments: newArguments });
              }}
              onNameChange={(newName) => {
                const newArguments = [...value.arguments];
                newArguments[index] = { ...newArguments[index], name: newName };
                onChange({ ...value, arguments: newArguments });
              }}
            />
          ))}
        </div>

        <button
          onClick={() => onAddItem([])}
          className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-t border-gray-200"
        >
          <Plus size={14} />
          Add Argument
        </button>
      </div>
    );
  }

  return null;
};

interface NestedPanelProps {
  value: ComplexValue;
  path: number[];
  panelValue: ComplexValue;
  top: number;
  depth: number;
  onPanelToggle: (item: { path: number[]; value: ComplexValue; position: number }, depth: number) => void;
  onAddItem: (path: number[]) => void;
  onAddProperty: (path: number[]) => void;
  onChange: (value: ComplexValue) => void;
  availableVariables?: string[];
}

const NestedPanel: React.FC<NestedPanelProps> = ({
  value,
  path,
  panelValue,
  top,
  depth,
  onPanelToggle,
  onAddItem,
  onAddProperty,
  onChange,
  availableVariables = []
}) => {
  const getValueAtPath = (val: ComplexValue, p: number[]): ComplexValue => {
    if (p.length === 0) return val;
    const [index, ...rest] = p;
    if (val.type === 'array') {
      return getValueAtPath(val.items[index], rest);
    } else if (val.type === 'object') {
      return getValueAtPath(val.properties[index].value, rest);
    }
    return val;
  };

  const currentValue = getValueAtPath(value, path) || panelValue;

  return (
    <div
      className="absolute"
      style={{
        top: `${top}px`,
        left: `${256 * depth}px`
      }}
    >
      <RootPanel
        value={currentValue}
        onChange={onChange}
        onPanelToggle={(item) => {
          onPanelToggle(
            {
              path: [...path, ...item.path],
              value: item.value,
              position: item.position
            },
            depth + 1
          );
        }}
        onAddItem={(subPath) => onAddItem([...path, ...subPath])}
        onAddProperty={(subPath) => onAddProperty([...path, ...subPath])}
        availableVariables={availableVariables}
      />
    </div>
  );
};

interface ArrayItemRowProps {
  index: number;
  item: ComplexValue;
  onClick: (position: number) => void;
  onDelete: () => void;
}

const ArrayItemRow: React.FC<ArrayItemRowProps> = ({ index, item, onClick, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (item.type !== 'simple' && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const containerRect = ref.current.closest('.relative')?.getBoundingClientRect();
      const relativeTop = containerRect ? rect.top - containerRect.top : rect.top;
      onClick(relativeTop);
    }
  };

  const getPreview = () => {
    if (item.type === 'simple') return item.value || '""';
    if (item.type === 'array') return `Array [${item.items.length}]`;
    if (item.type === 'object') return `Object {${item.properties.length}}`;
    if (item.type === 'function-call') return `${item.functionName}(...)`;
  };

  return (
    <div
      ref={ref}
      className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between group cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xs text-gray-400 font-mono">[{index}]</span>
        <span className="text-sm text-gray-700 truncate">{getPreview()}</span>
      </div>
      <div className="flex items-center gap-2">
        {item.type !== 'simple' && (
          <ChevronRight size={16} className="text-gray-400" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
        >
          ×
        </button>
      </div>
    </div>
  );
};

interface ObjectPropertyRowProps {
  index: number;
  property: { key: string; value: ComplexValue };
  onClick: (position: number) => void;
  onDelete: () => void;
}

const ObjectPropertyRow: React.FC<ObjectPropertyRowProps> = ({ property, onClick, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (property.value.type !== 'simple' && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const containerRect = ref.current.closest('.relative')?.getBoundingClientRect();
      const relativeTop = containerRect ? rect.top - containerRect.top : rect.top;
      onClick(relativeTop);
    }
  };

  const getPreview = () => {
    const val = property.value;
    if (val.type === 'simple') return val.value || '""';
    if (val.type === 'array') return `Array [${val.items.length}]`;
    if (val.type === 'object') return `Object {${val.properties.length}}`;
    if (val.type === 'function-call') return `${val.functionName}(...)`;
  };

  return (
    <div
      ref={ref}
      className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between group cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-xs text-blue-600 font-mono">{property.key}</span>
        <span className="text-xs text-gray-400">:</span>
        <span className="text-sm text-gray-700 truncate">{getPreview()}</span>
      </div>
      <div className="flex items-center gap-2">
        {property.value.type !== 'simple' && (
          <ChevronRight size={16} className="text-gray-400" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
        >
          ×
        </button>
      </div>
    </div>
  );
};

interface SimpleValueRowProps {
  value: SimpleValue;
  availableVariables?: string[];
  onChange: (value: SimpleValue) => void;
}

const SimpleValueRow: React.FC<SimpleValueRowProps> = ({ value, availableVariables, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.value);

  const handleSave = () => {
    onChange({ type: 'simple', value: editValue });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4">
        <SimpleValueEditModal
          isOpen={isEditing}
          onClose={() => {
            setEditValue(value.value);
            setIsEditing(false);
          }}
          onSave={(newValue) => {
            onChange({ type: 'simple', value: newValue });
            setIsEditing(false);
          }}
          initialValue={value.value}
          availableVariables={availableVariables}
        />
      </div>
    );
  }

  return (
    <div
      className="px-4 py-3 hover:bg-gray-50 cursor-pointer group"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg">📝</span>
          <span className="text-sm text-gray-700 font-mono truncate">
            {value.value || '""'}
          </span>
        </div>
        <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
          ✏️
        </span>
      </div>
    </div>
  );
};

interface FunctionArgumentRowProps {
  index: number;
  argument: { name?: string; value: ComplexValue };
  onClick: (position: number) => void;
  onDelete: () => void;
  onNameChange: (name: string | undefined) => void;
}

const FunctionArgumentRow: React.FC<FunctionArgumentRowProps> = ({ index, argument, onClick, onDelete, onNameChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editingName, setEditingName] = useState(false);

  const handleClick = () => {
    if (argument.value.type !== 'simple' && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const containerRect = ref.current.closest('.relative')?.getBoundingClientRect();
      const relativeTop = containerRect ? rect.top - containerRect.top : rect.top;
      onClick(relativeTop);
    }
  };

  const getPreview = () => {
    const val = argument.value;
    if (val.type === 'simple') return val.value || '""';
    if (val.type === 'array') return `Array [${val.items.length}]`;
    if (val.type === 'object') return `Object {${val.properties.length}}`;
    if (val.type === 'function-call') return `${val.functionName}(...)`;
  };

  return (
    <div
      ref={ref}
      className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between group cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {editingName ? (
          <input
            type="text"
            value={argument.name || ''}
            onChange={(e) => onNameChange(e.target.value || undefined)}
            onBlur={() => setEditingName(false)}
            onClick={(e) => e.stopPropagation()}
            className="w-20 px-1 py-0 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="name"
            autoFocus
          />
        ) : argument.name ? (
          <span
            className="text-xs text-purple-600 font-mono cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditingName(true);
            }}
          >
            {argument.name}=
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingName(true);
            }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            + name
          </button>
        )}
        <span className="text-sm text-gray-700 truncate">{getPreview()}</span>
      </div>
      <div className="flex items-center gap-2">
        {argument.value.type !== 'simple' && (
          <ChevronRight size={16} className="text-gray-400" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
        >
          ×
        </button>
      </div>
    </div>
  );
};
