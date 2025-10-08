import React, { useState, useRef } from 'react';
import type { ComplexValue, ArrayValue, ObjectValue, SimpleValue } from '../../types/values';
import { ChevronRight, Plus } from 'lucide-react';
import { AddArrayItemModal, AddObjectPropertyModal } from '../modals/AddValueModal';

interface Props {
  value: ComplexValue;
  onChange: (value: ComplexValue) => void;
}

interface OpenPanel {
  path: number[];
  value: ComplexValue;
  position: number;
  depth: number;
}

export const ComplexValueDisplay: React.FC<Props> = ({ value, onChange }) => {
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
}

const RootPanel: React.FC<RootPanelProps> = ({
  value,
  onChange,
  onPanelToggle,
  onAddItem,
  onAddProperty
}) => {
  if (value.type === 'simple') {
    return (
      <div className="w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <input
          type="text"
          value={value.value}
          onChange={(e) => onChange({ type: 'simple', value: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter value..."
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
  onChange
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
