/**
 * Type definitions for complex values (arrays and objects)
 * Supports recursive nesting of values
 */

export type ValueType = 'simple' | 'array' | 'object' | 'function-call';

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
 * Function call value - represents a function call with arguments
 * Example: add(5, 3), get_user("John", age=30)
 */
export interface FunctionCallValue {
  type: 'function-call';
  functionName: string;
  arguments: FunctionArgument[];
}

/**
 * A single argument in a function call
 * Can be positional or keyword argument
 */
export interface FunctionArgument {
  name?: string;  // For keyword arguments (e.g., age=30)
  value: ComplexValue;
}

/**
 * Complex value - can be simple, array, object, or function call
 * This is a recursive type that allows unlimited nesting
 */
export type ComplexValue = SimpleValue | ArrayValue | ObjectValue | FunctionCallValue;

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
 * Type guard to check if a value is a FunctionCallValue
 */
export function isFunctionCallValue(value: ComplexValue): value is FunctionCallValue {
  return value.type === 'function-call';
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

/**
 * Create a default function call value
 */
export function createFunctionCallValue(functionName: string = '', args: FunctionArgument[] = []): FunctionCallValue {
  return {
    type: 'function-call',
    functionName,
    arguments: args
  };
}
