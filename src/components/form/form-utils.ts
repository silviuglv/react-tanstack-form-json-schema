import type { HTMLInputTypeAttribute } from "react";
/**
 * https://www.learnjsonschema.com/2020-12
 */

export type FormatAnnotation =
  | string
  | "date-time"
  | "date"
  | "time"
  | "duration"
  | "email"
  | "idn-email"
  | "hostname"
  | "idn-hostname"
  | "ipv4"
  | "ipv6"
  | "uri"
  | "uri-reference"
  | "iri"
  | "iri-reference"
  | "uuid"
  | "uri-template"
  | "json-pointer"
  | "relative-json-pointer"
  | "regex";

export type FormCustomAnnotations = {
  "x-field-type"?: string;
  "x-field-options"?: Record<string, unknown>;
};

type BooleanOrSchema = boolean | JSONSchema;

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
  format?: FormatAnnotation;
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: JSONSchema;
  _prefault?: unknown;
};

export type JSONSchema = JSONSchemaBase & FormCustomAnnotations;

export type FieldConfig = {
  fieldType: string;
  fieldName: string;
  fieldProps: Record<string, unknown>;
};

export const mapFormatToInputType = (annotation?: FormatAnnotation): HTMLInputTypeAttribute => {
  switch (annotation) {
    case "date":
      return "date";
    case "date-time":
      return "datetime-local";
    case "email":
    case "idn-email":
      return "email";
    case "time":
      return "time";
    case "uri":
      return "url";
    default:
      return "text";
  }
};

export const createFieldProps = (schema: JSONSchema, required?: boolean) => {
  const props = {
    label: schema.title,
    description: schema.description,
    required: required,
    defaultValue: schema.default,
    readOnly: schema.readOnly,
    writeOnly: schema.writeOnly,
    // schema: schema,
    placeholder: schema["x-field-options"]?.placeholder ?? schema.examples?.[0] ?? undefined,
    ...(schema["x-field-options"] ?? {}),
  };

  if (schema.type === "string") {
    return {
      ...props,
      type: mapFormatToInputType(schema.format),
      minLength: schema.minLength,
      maxLength: schema.maxLength,
      pattern: schema.pattern,
    };
  }

  if (schema.type === "number") {
    return {
      ...props,
      type: "number",
      min: schema.minimum,
      max: schema.maximum,
    };
  }

  return props;
};
