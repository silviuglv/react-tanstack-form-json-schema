import { HTMLInputTypeAttribute } from "react";
import { FormatAnnotation, JSONSchema } from "./types";

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

export const getPathPrefix = (path: string, prefix?: string) => {
  if (!prefix) return path;
  return `${prefix}.${path}`;
};

export const getFieldProps = (schema: JSONSchema, required?: boolean) => {
  const props = {
    label: schema.title,
    description: schema.description,
    required: required,
    defaultValue: schema.default,
    readOnly: schema.readOnly,
    writeOnly: schema.writeOnly,
    schema: schema,
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
      min: schema.minimum,
      max: schema.maximum,
    };
  }

  return props;
};
