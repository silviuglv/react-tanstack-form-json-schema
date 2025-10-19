import { JSONSchemaArray, SchemaRenderer } from "./types";
import { RenderJsonSchema } from "./render-json-schema";

export const RenderArrayObject: SchemaRenderer<
  { pathPrefix?: string; required?: boolean },
  JSONSchemaArray
> = ({ form, schema, pathPrefix, required }) => {
  const { items } = schema;

  if (!items) {
    return null;
  }

  return (
    <RenderJsonSchema form={form} schema={items} pathPrefix={pathPrefix} required={required} />
  );
};
