import { IRenderProps, JSONSchemaArray } from "./types";
import { RenderJsonSchema } from "./render-json-schema";

interface RenderJsonArrayProps extends IRenderProps {
  schema: JSONSchemaArray;
}

export const RenderArrayObject = ({ form, schema, pathPrefix, required }: RenderJsonArrayProps) => {
  const { items } = schema;

  if (!items) {
    return null;
  }

  return (
    <RenderJsonSchema form={form} schema={items} pathPrefix={pathPrefix} required={required} />
  );
};
