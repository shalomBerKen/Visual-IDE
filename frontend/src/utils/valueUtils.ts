import type { ComplexValue, SimpleValue, ArrayValue, ObjectValue } from '../types/values';
import { createSimpleValue } from '../types/values';

/**
 * Compile a ComplexValue to Python code string
 */
export function compileComplexValue(value: ComplexValue): string {
  switch (value.type) {
    case 'simple':
      return value.value || '""';

    case 'array':
      if (value.items.length === 0) {
        return '[]';
      }
      const items = value.items.map(item => compileComplexValue(item));
      return `[${items.join(', ')}]`;

    case 'object':
      if (value.properties.length === 0) {
        return '{}';
      }
      const props = value.properties.map(prop => {
        const key = prop.key.includes('"') ? `'${prop.key}'` : `"${prop.key}"`;
        const val = compileComplexValue(prop.value);
        return `${key}: ${val}`;
      });
      return `{${props.join(', ')}}`;

    default:
      return '""';
  }
}

/**
 * Migrate old string value to ComplexValue format
 * This ensures backward compatibility with existing code
 */
export function migrateValue(oldValue: string | ComplexValue): ComplexValue {
  // If it's already a ComplexValue, return as-is
  if (typeof oldValue === 'object' && 'type' in oldValue) {
    return oldValue;
  }

  // Otherwise, convert string to SimpleValue
  return createSimpleValue(oldValue);
}

/**
 * Validate that an object doesn't have duplicate keys
 */
export function validateObjectKeys(value: ObjectValue): { valid: boolean; duplicateKeys: string[] } {
  const keys = value.properties.map(prop => prop.key);
  const uniqueKeys = new Set(keys);

  if (keys.length === uniqueKeys.size) {
    return { valid: true, duplicateKeys: [] };
  }

  // Find duplicate keys
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
  return { valid: false, duplicateKeys: [...new Set(duplicates)] };
}

/**
 * Get a compact display string for a complex value
 * Truncates long values for display in blocks
 */
export function getValueDisplayString(value: ComplexValue, maxLength: number = 50): string {
  const compiled = compileComplexValue(value);

  if (compiled.length <= maxLength) {
    return compiled;
  }

  // Truncate and add ellipsis
  return compiled.substring(0, maxLength - 3) + '...';
}

/**
 * Count total items in a complex value (for displaying item count)
 */
export function countValueItems(value: ComplexValue): number {
  switch (value.type) {
    case 'simple':
      return 1;

    case 'array':
      return value.items.reduce((sum, item) => sum + countValueItems(item), 0);

    case 'object':
      return value.properties.reduce((sum, prop) => sum + countValueItems(prop.value), 0);

    default:
      return 0;
  }
}

/**
 * Deep clone a complex value
 */
export function cloneComplexValue(value: ComplexValue): ComplexValue {
  switch (value.type) {
    case 'simple':
      return { ...value };

    case 'array':
      return {
        type: 'array',
        items: value.items.map(item => cloneComplexValue(item))
      };

    case 'object':
      return {
        type: 'object',
        properties: value.properties.map(prop => ({
          key: prop.key,
          value: cloneComplexValue(prop.value)
        }))
      };

    default:
      return createSimpleValue('');
  }
}

/**
 * Check if a complex value is empty
 */
export function isValueEmpty(value: ComplexValue): boolean {
  switch (value.type) {
    case 'simple':
      return !value.value || value.value.trim() === '';

    case 'array':
      return value.items.length === 0;

    case 'object':
      return value.properties.length === 0;

    default:
      return true;
  }
}
