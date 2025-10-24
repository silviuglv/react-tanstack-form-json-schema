import type { JSONSchema } from "./form-utils";

/**
 * Field mappings configuration
 * Keys follow the pattern: "type:modifier:constraint"
 * Values are field component names
 *
 * The resolver uses cascading fallback:
 * 1. Try full key: "type:modifier:constraint"
 * 2. Remove constraint: "type:modifier"
 * 3. Remove modifier: "type"
 * 4. Use fallback
 */
export interface FieldMappings {
  // Core type primitives
  string?: string;
  number?: string;
  integer?: string;
  boolean?: string;
  array?: string;
  object?: string;
  null?: string;

  // String modifiers
  "string:file"?: string; // contentMediaType
  "string:textarea"?: string; // maxLength > threshold
  "string:date"?: string; // format: date
  "string:datetime"?: string; // format: date-time
  "string:time"?: string; // format: time
  "string:color"?: string; // pattern: hex color

  // Number modifiers
  "number:range"?: string; // has min & max
  "integer:range"?: string; // has min & max

  // Enum patterns
  enum?: string;
  "enum:small"?: string; // ≤ threshold
  "enum:large"?: string; // > threshold

  // Array patterns
  "array:string"?: string;
  "array:number"?: string;
  "array:enum"?: string;
  "array:object"?: string;
  "array:tuple"?: string;

  // Composition patterns
  "anyOf:const:small"?: string;
  "anyOf:const:large"?: string;
  "anyOf:mixed"?: string;
  "oneOf:const:small"?: string;
  "oneOf:const:large"?: string;
  "oneOf:mixed"?: string;
  anyOf?: string;
  oneOf?: string;
  allOf?: string;

  // Special
  const?: string;
  conditional?: string;
  "object:additionalProperties"?: string;

  // Fallback (required)
  fallback?: string;

  // Allow custom keys
  [key: string]: string | undefined;
}

/**
 * Configuration for field type determination
 */
export interface FieldTypeDeterminatorConfig {
  /**
   * Custom field mappings (overrides defaults)
   */
  fieldMappings?: FieldMappings;

  /**
   * Number of enum values where "large" threshold is reached
   * @default 5
   */
  enumThreshold?: number;

  /**
   * String maxLength where textarea is preferred
   * @default 100
   */
  textareaThreshold?: number;
}

/**
 * Default L1 field mappings (minimal primitives only)
 */
const DEFAULT_FIELD_MAPPINGS: FieldMappings = {
  // Core types
  string: "TextField",
  number: "NumberField",
  integer: "NumberField",
  boolean: "CheckboxField",
  array: "TextField", // Fallback for unsupported array types
  object: "", // Should be handled by renderer
  null: "", // Skip rendering

  // Special keywords
  const: "TextField",
  enum: "SelectField",
  anyOf: "", // Will render first schema
  oneOf: "", // Will render first schema
  allOf: "", // Special: merge schemas

  // Fallback
  fallback: "TextField",
};

/**
 * Resolve field mapping with cascading fallback
 * Automatically appends "fallback" to the end of the keys array
 *
 * @param mappings - The field mappings object
 * @param keys - Array of keys to try in order (most specific to least specific)
 * @returns The field component name, or empty string
 */
function resolveMapping(mappings: FieldMappings, keys: string[]): string {
  // Always try fallback as the last option
  const allKeys = [...keys, "fallback"];

  for (const key of allKeys) {
    const fieldType = mappings[key];
    if (fieldType !== undefined) {
      return fieldType;
    }
  }
  return "";
}

/**
 * Build cascading keys from parts
 * Example: buildKeys(["string", "date", "small"])
 * Returns: ["string:date:small", "string:date", "string"]
 */
function buildKeys(parts: string[]): string[] {
  const keys: string[] = [];
  for (let i = parts.length; i > 0; i--) {
    keys.push(parts.slice(0, i).join(":"));
  }
  return keys;
}

/**
 * Helper: Check if all items in an array are const schemas
 */
function areAllConstSchemas(schemas: JSONSchema[]): boolean {
  return schemas.length > 0 && schemas.every((s) => s.const !== undefined);
}

/**
 * Helper: Check if schema has both minimum and maximum defined
 */
function hasBothMinMax(schema: JSONSchema): boolean {
  return schema.minimum !== undefined && schema.maximum !== undefined;
}

/**
 * Helper: Merge allOf schemas into a single schema
 */
function mergeAllOfSchemas(schemas: JSONSchema[]): JSONSchema {
  const merged: JSONSchema = {};
  for (const schema of schemas) {
    Object.assign(merged, schema);
  }
  return merged;
}

/**
 * Determines the appropriate field component type for a given JSON Schema
 * Uses a mapping-based approach with cascading fallback
 *
 * @param schema - The JSON Schema to analyze
 * @param config - Configuration options including custom field mappings
 * @returns The field component name (e.g., "TextField", "SelectField")
 */
export function determineFieldType(
  schema: JSONSchema,
  config: FieldTypeDeterminatorConfig = {}
): string {
  const {
    fieldMappings: customMappings = {},
    enumThreshold = 5,
    textareaThreshold = 100,
  } = config;

  // Merge custom mappings with defaults (custom overrides defaults)
  const mappings: FieldMappings = { ...DEFAULT_FIELD_MAPPINGS, ...customMappings };

  // Priority 1: Explicit override via x-field-type
  if (schema["x-field-type"]) {
    return schema["x-field-type"];
  }

  // Priority 2: Const
  if (schema.const !== undefined) {
    const keys = buildKeys(["const"]);
    return resolveMapping(mappings, keys);
  }

  // Priority 3: Enum
  if (schema.enum && schema.enum.length > 0) {
    const size = schema.enum.length <= enumThreshold ? "small" : "large";
    const keys = buildKeys(["enum", size]);
    return resolveMapping(mappings, keys);
  }

  // Priority 4: Composition keywords

  // allOf - merge schemas and reapply rules
  if (schema.allOf && schema.allOf.length > 0) {
    const merged = mergeAllOfSchemas(schema.allOf);
    return determineFieldType(merged, config);
  }

  // anyOf with all const values
  if (schema.anyOf && areAllConstSchemas(schema.anyOf)) {
    const size = schema.anyOf.length <= enumThreshold ? "small" : "large";
    const keys = buildKeys(["anyOf", "const", size]);
    return resolveMapping(mappings, [...keys, "enum"]);
  }

  // oneOf with all const values
  if (schema.oneOf && areAllConstSchemas(schema.oneOf)) {
    const size = schema.oneOf.length <= enumThreshold ? "small" : "large";
    const keys = buildKeys(["oneOf", "const", size]);
    return resolveMapping(mappings, [...keys, "enum"]);
  }

  // anyOf with mixed types
  if (schema.anyOf && schema.anyOf.length > 0) {
    const keys = buildKeys(["anyOf", "mixed"]);
    const fieldType = resolveMapping(mappings, keys);
    if (fieldType) return fieldType;
    // Fallback: render first schema
    return determineFieldType(schema.anyOf[0], config);
  }

  // oneOf with mixed types
  if (schema.oneOf && schema.oneOf.length > 0) {
    const keys = buildKeys(["oneOf", "mixed"]);
    const fieldType = resolveMapping(mappings, keys);
    if (fieldType) return fieldType;
    // Fallback: render first schema
    return determineFieldType(schema.oneOf[0], config);
  }

  // Priority 5: Conditional
  if (schema.if && schema.then) {
    const keys = buildKeys(["conditional"]);
    const fieldType = resolveMapping(mappings, keys);
    if (fieldType) return fieldType;
    // Fallback: render then schema
    if (typeof schema.then === "object") {
      return determineFieldType(schema.then, config);
    }
    return resolveMapping(mappings, []);
  }

  // Priority 6: Type-specific rules

  if (!schema.type) {
    // No type specified - infer
    if (schema.properties) {
      // Has properties → treat as object
      return resolveMapping(mappings, ["object"]);
    }
    return resolveMapping(mappings, []);
  }

  // Boolean
  if (schema.type === "boolean") {
    const keys = buildKeys(["boolean"]);
    return resolveMapping(mappings, keys);
  }

  // String
  if (schema.type === "string") {
    const parts = ["string"];

    // Check for contentMediaType (file upload)
    if (schema.contentMediaType) {
      parts.push("file");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }

    // Check for long text
    if (schema.maxLength && schema.maxLength > textareaThreshold) {
      parts.push("textarea");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }

    // Check for date/time formats
    if (schema.format === "date") {
      parts.push("date");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }
    if (schema.format === "date-time") {
      parts.push("datetime");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }
    if (schema.format === "time") {
      parts.push("time");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }

    // Check for color pattern
    if (schema.pattern === "^#[0-9A-Fa-f]{6}$" || schema.pattern === "^#[0-9a-fA-F]{6}$") {
      parts.push("color");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }

    // Default string
    const keys = buildKeys(parts);
    return resolveMapping(mappings, keys);
  }

  // Number/Integer
  if (schema.type === "number" || schema.type === "integer") {
    const parts: string[] = [schema.type];

    // Check for range (both min and max)
    if (hasBothMinMax(schema)) {
      parts.push("range");
    }

    const keys = buildKeys(parts);
    return resolveMapping(mappings, keys);
  }

  // Array
  if (schema.type === "array") {
    const parts = ["array"];

    // Tuple (prefixItems)
    if (schema.prefixItems && schema.prefixItems.length > 0) {
      parts.push("tuple");
      const keys = buildKeys(parts);
      return resolveMapping(mappings, keys);
    }

    if (schema.items && typeof schema.items === "object") {
      const itemSchema = schema.items as JSONSchema;

      // Array of enum
      if (itemSchema.enum) {
        parts.push("enum");
        const keys = buildKeys(parts);
        return resolveMapping(mappings, keys);
      }

      // Array of objects
      if (itemSchema.type === "object") {
        parts.push("object");
        const keys = buildKeys(parts);
        return resolveMapping(mappings, keys);
      }

      // Array of string
      if (itemSchema.type === "string") {
        parts.push("string");
        const keys = buildKeys(parts);
        return resolveMapping(mappings, keys);
      }

      // Array of number
      if (itemSchema.type === "number") {
        parts.push("number");
        const keys = buildKeys(parts);
        return resolveMapping(mappings, keys);
      }
    }

    // Fallback for arrays
    const keys = buildKeys(parts);
    return resolveMapping(mappings, keys);
  }

  // Object
  if (schema.type === "object") {
    const parts = ["object"];

    // additionalProperties without properties
    if (schema.additionalProperties && !schema.properties) {
      parts.push("additionalProperties");
    }

    const keys = buildKeys(parts);
    return resolveMapping(mappings, keys);
  }

  // Null
  if (schema.type === "null") {
    return resolveMapping(mappings, ["null"]);
  }

  // Ultimate fallback
  return resolveMapping(mappings, []);
}

/**
 * Get the default field mappings
 * Useful for extending or inspecting defaults
 */
export function getDefaultFieldMappings(): Readonly<FieldMappings> {
  return DEFAULT_FIELD_MAPPINGS;
}
