/**
 * Type definitions for complex values (arrays and objects)
 * Supports recursive nesting of values
 */

export type ValueType = 'simple' | 'array' | 'object';

/**
 * Simple value - a string that can be a literal, expression, or variable reference
 * Examples: "42", "'hello'", "True", "x + 5", "my_var"
 */
export interface SimpleValue {
  type: 'simple';
  value: string;
}

/**
 * Array value - ordered list of values (can contain simple, array, or object values)
 * Example: [1, 2, [3, 4], {"name": "John"}]
 */
export interface ArrayValue {
  type: 'array';
  items: ComplexValue[];
}

/**
 * Object value - key-value pairs where values can be simple, array, or object
 * Example: {"name": "John", "age": 30, "hobbies": ["reading", "coding"]}
 */
export interface ObjectValue {
  type: 'object';
  properties: ObjectProperty[];
}

/**
 * A single property in an object
 */
export interface ObjectProperty {
  key: string;
  value: ComplexValue;
}

/**
 * Complex value - can be simple, array, or object
 * This is a recursive type that allows unlimited nesting
 */
export type ComplexValue = SimpleValue | ArrayValue | ObjectValue;

/**
 * Type guard to check if a value is a SimpleValue
 */
export function isSimpleValue(value: ComplexValue): value is SimpleValue {
  return value.type === 'simple';
}

/**
 * Type guard to check if a value is an ArrayValue
 */
export function isArrayValue(value: ComplexValue): value is ArrayValue {
  return value.type === 'array';
}

/**
 * Type guard to check if a value is an ObjectValue
 */
export function isObjectValue(value: ComplexValue): value is ObjectValue {
  return value.type === 'object';
}

/**
 * Create a default simple value
 */
export function createSimpleValue(value: string = ''): SimpleValue {
  return {
    type: 'simple',
    value
  };
}

/**
 * Create a default array value
 */
export function createArrayValue(items: ComplexValue[] = []): ArrayValue {
  return {
    type: 'array',
    items
  };
}

/**
 * Create a default object value
 */
export function createObjectValue(properties: ObjectProperty[] = []): ObjectValue {
  return {
    type: 'object',
    properties
  };
}
