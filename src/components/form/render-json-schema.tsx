import { Fragment, type ComponentType } from "react";
import { withForm } from "./form-base";
import type { FieldConfig, JSONSchema } from "./form-utils";
import type { AnyFieldApi } from "@tanstack/form-core";

const getFieldName = (path: string, prefix?: string) => {
  if (!prefix) return path;
  return `${prefix}.${path}`;
};

const getComponent = (fieldApi: AnyFieldApi, fieldType: string): ComponentType => {
  if (fieldType in fieldApi && typeof fieldApi[fieldType as keyof typeof fieldApi] === "function") {
    return fieldApi[fieldType as keyof typeof fieldApi] as ComponentType;
  }
  console.warn(`Field component "${fieldType}" not found.`);
  return Fragment;
};

const createFieldConfig = (
  schema: JSONSchema,
  fieldName: string,
  fieldType: string,
  required?: boolean
): FieldConfig => {
  return {
    fieldName,
    fieldType,
    fieldProps: {
      label: schema.title,
      description: schema.description,
      required: required ?? false,
    },
  };
};

const collectFieldConfigs = (
  schema: JSONSchema | null,
  fieldName?: string,
  required: boolean = false,
  fields: FieldConfig[] = []
): FieldConfig[] => {
  if (!schema) {
    throw new Error("invalid json schema");
  }

  if (schema["x-field-type"] && fieldName) {
    const config = createFieldConfig(schema, fieldName, schema["x-field-type"], required);
    return [...fields, config];
  }

  if (!schema.type) {
    // TODO: handle special case schemas, like unions
    return [...fields];
  }

  if (schema.type === "object") {
    const { properties, required = [] } = schema;

    if (!properties) return [...fields];

    const propFields = Object.entries(properties).map(([propName, propSchema]) => {
      if (typeof propSchema === "boolean") return null;
      const propFieldName = getFieldName(propName, fieldName);
      return collectFieldConfigs(propSchema, propFieldName, required.includes(propName), fields);
    });

    return [...fields, ...(propFields.flat().filter(Boolean) as FieldConfig[])];
  }

  if (schema.type === "string" && fieldName) {
    const config = createFieldConfig(schema, fieldName, "TextField", required);
    return [...fields, config];
  }

  return [...fields];
};

export const RenderJsonSchema = withForm({
  props: {
    schema: null as JSONSchema | null,
  },
  render: function Render({ form, schema }) {
    const fields = collectFieldConfigs(schema);

    return (
      <>
        {fields.map(({ fieldName, fieldType, fieldProps }) => (
          <form.AppField
            key={fieldName}
            name={fieldName}
            children={(field) => {
              const Component = getComponent(field, fieldType);

              return <Component {...fieldProps} />;
            }}
          />
        ))}
      </>
    );
  },
});
