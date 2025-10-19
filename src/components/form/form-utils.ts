export type BooleanOrSchema = boolean | JSONSchema;

type JSONSchemaBase = {
  [k: string]: unknown;
  $schema?:
    | "https://json-schema.org/draft/2020-12/schema"
    | "http://json-schema.org/draft-07/schema#"
    | "http://json-schema.org/draft-04/schema#";
  $id?: string;
  $anchor?: string;
  $ref?: string;
  $dynamicRef?: string;
  $dynamicAnchor?: string;
  $vocabulary?: Record<string, boolean>;
  $comment?: string;
  $defs?: Record<string, JSONSchema>;
  type?: "object" | "array" | "string" | "number" | "boolean" | "null" | "integer";
  additionalItems?: BooleanOrSchema;
  unevaluatedItems?: BooleanOrSchema;
  prefixItems?: BooleanOrSchema[];
  items?: BooleanOrSchema | BooleanOrSchema[];
  contains?: BooleanOrSchema;
  additionalProperties?: BooleanOrSchema;
  unevaluatedProperties?: BooleanOrSchema;
  properties?: Record<string, BooleanOrSchema>;
  patternProperties?: Record<string, BooleanOrSchema>;
  dependentSchemas?: Record<string, BooleanOrSchema>;
  propertyNames?: BooleanOrSchema;
  if?: BooleanOrSchema;
  then?: BooleanOrSchema;
  else?: BooleanOrSchema;
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: BooleanOrSchema;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number | boolean;
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxContains?: number;
  minContains?: number;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  dependentRequired?: Record<string, string[]>;
  enum?: Array<string | number | boolean | null>;
  const?: string | number | boolean | null;
  id?: string;
  title?: string;
  description?: string;
  default?: unknown;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  nullable?: boolean;
  examples?: unknown[];
  format?: string;
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: JSONSchema;
  _prefault?: unknown;
};

export type FormCustomAnnotations = {
  "x-field-type"?: string;
  "x-field-options"?: Record<string, unknown>;
};

export type JSONSchema = JSONSchemaBase & FormCustomAnnotations;

export type FieldConfig = {
  fieldType: string;
  fieldName: string;
  fieldProps: Record<string, unknown>;
};
