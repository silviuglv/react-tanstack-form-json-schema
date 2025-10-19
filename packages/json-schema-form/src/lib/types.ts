/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppFieldExtendedReactFormApi } from "@tanstack/react-form";
import { ComponentType } from "react";

/**
 * https://www.learnjsonschema.com/2020-12
 */

export interface JSONSchemaCore {
  $id?: string;
  $schema?: string;
  $ref?: string;
  $comment?: string;
  $defs?: Record<string, JSONSchema>;
  $anchor?: string;
  $dynamicAnchor?: string;
  $dynamicRef?: string;
  $vocabulary?: string;
}

export interface JSONSchemaApplicator {
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  if?: JSONSchema;
  then?: JSONSchema;
  else?: JSONSchema;
  not?: JSONSchema;
}

export interface JSONSchemaValidator {
  type?: "null" | "boolean" | "object" | "array" | "number" | "string";
  enum?: any[];
  const?: any;
}

export interface JSONSchemaMeta {
  title?: string;
  description?: string;
  default?: any;
  deprecated?: boolean;
  examples?: any[];
  readOnly?: boolean;
  writeOnly?: boolean;
}

export type FormatAnnotation =
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

export interface JSONSchemaCustomAnnotation {
  "x-field-type"?: string;
  "x-field-options"?: Record<string, unknown>;
}

export interface JSONSchemaCommon
  extends JSONSchemaCore,
    JSONSchemaApplicator,
    JSONSchemaValidator,
    JSONSchemaMeta,
    JSONSchemaCustomAnnotation {}

export interface JSONSchemaNull {
  type?: "null";
}

export interface JSONSchemaBoolean {
  type?: "boolean";
}

export interface JSONSchemaNumber {
  type?: "number";
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  minimum?: number;
  multipleOf?: number;
}

export interface JSONSchemaString {
  type?: "string";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  format?: FormatAnnotation;
  contentEncoding?: string;
  contentMediaType?: string;
  contentSchema?: string;
}

export interface JSONSchemaObject extends JSONSchemaCommon {
  type?: "object";
  properties: Record<string, JSONSchema>;
  additionalProperties: JSONSchema | false;
  patternProperties?: Record<string, JSONSchema>;
  dependentSchemas?: Record<string, JSONSchema>;
  propertyNames?: JSONSchema;
  dependentRequired?: Record<string, string[]>;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  unevaluatedProperties?: string;
}

export interface JSONSchemaArray extends JSONSchemaCommon {
  type?: "array";
  contains?: JSONSchema;
  items?: JSONSchema;
  prefixItems?: JSONSchema[];
  maxItems?: number;
  minItems?: number;
  maxContains?: number;
  minContains?: number;
  uniqueItems?: number;
  unevaluatedItems?: JSONSchema;
}

export type JSONSchema = JSONSchemaCommon &
  (
    | JSONSchemaNull
    | JSONSchemaBoolean
    | JSONSchemaNumber
    | JSONSchemaString
    | JSONSchemaArray
    | JSONSchemaObject
  );

export interface IRenderProps {
  form: NoInfer<FormApi>;
  schema: JSONSchema;
  pathPrefix?: string;
  required?: boolean;
}

export type FormApi<
  TComponents extends Record<string, ComponentType<any>> = Record<string, ComponentType<any>>,
> = AppFieldExtendedReactFormApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  TComponents,
  TComponents
>;
